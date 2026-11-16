"use server";

import { apiRequest, type ActionResponse } from "@/lib/api";

// The floor app (Master Briefing v4, part 3). GM and every hotel staff account.

export type Department = "HSK" | "TD" | "FO" | "FB";
export type ChecklistKind = "legionella" | "haccp" | "mod" | "preventive";
export type Shift = "morning" | "evening" | "night";
export type WasteReason = "leftover_buffet" | "expired" | "breakage" | "prep_error";

export interface LogEntry {
  _id: string;
  kind: "handover" | "appointment";
  date: string;
  time: string;
  text: string;
  department: Department | "";
  authorName: string;
  createdAt: string;
}

export interface ChecklistItem {
  _id: string;
  list: ChecklistKind;
  section: string;
  label: string;
  kind: "temp" | "check";
  department: Department | "";
  maxC: number | null;
  minC: number | null;
  intervalDays: number | null;
  external: boolean;
  nextDue: string | null;
  lastDone: string | null;
}

export interface FloorToday {
  date: string;
  hotel: string;
  me: { name: string; hotelRole: "gm" | "dept_manager" | "staff" | "shared"; department: Department | "" };
  /** GM or department manager. */
  manager: boolean;
  handovers: LogEntry[];
  appointments: LogEntry[];
  dueTasks: ChecklistItem[];
  openIssues: number;
  flush: { done: number; total: number; overdue: number };
  missedYesterday: { shift: Shift | ""; missed: number }[];
  orderQueue: number | null;
}

export interface Space {
  _id: string;
  name: string;
  kind: "room" | "space";
  floor: string;
  waterPoint: boolean;
  vacantSince: string | null;
  outOfOrder: boolean;
  specs: string;
}

export interface Issue {
  _id: string;
  space: { _id: string; name: string } | null;
  location: string;
  department: Department | "";
  title: string;
  photo: string;
  outOfOrder: boolean;
  status: "open" | "fixed";
  reporterName: string;
  fixedAt: string | null;
  createdAt: string;
}

export interface ChecklistEntry {
  _id: string;
  item: string | null;
  space: string | null;
  date: string;
  shift: Shift | "";
  value: number | null;
  value2: number | null;
  done: boolean;
  ok: boolean;
  note: string;
  signerName: string;
  createdAt: string;
}

export interface FlushPoint {
  space: Pick<Space, "_id" | "name" | "floor" | "waterPoint" | "vacantSince">;
  last: ChecklistEntry | null;
  flushedToday: boolean;
  overdue: boolean;
}

export type Checklist =
  | { list: "legionella"; date: string; limits: { coldMax: number; warmMin: number; flushEveryDays: number; vacantDays: number }; points: FlushPoint[]; entries: ChecklistEntry[] }
  | { list: Exclude<ChecklistKind, "legionella">; date: string; items: ChecklistItem[]; entries: ChecklistEntry[] };

export interface Waste {
  _id: string;
  date: string;
  product: string;
  quantity: string;
  reason: WasteReason;
  authorName: string;
}

export interface Product {
  _id: string;
  name: string;
  photo: string;
  department: Department | "";
  supplierName: string;
  supplierPhone: string;
  supplierEmail: string;
}

export interface ProductRequest {
  _id: string;
  product: Product;
  quantity: number;
  note: string;
  status: "requested" | "ordered" | "received";
  requesterName: string;
  createdAt: string;
}

const fail = (what: string) => `Failed to ${what}.`;

export async function getTodayAction(): Promise<ActionResponse<FloorToday>> {
  return apiRequest<FloorToday>("/floor/today", { fallbackError: fail("load today") });
}

export async function addLogAction(data: { kind: LogEntry["kind"]; text: string; time?: string; date?: string; department?: string }): Promise<ActionResponse<LogEntry>> {
  return apiRequest<LogEntry>("/floor/log", { method: "POST", body: data, fallbackError: fail("save the note") });
}

export async function deleteLogAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/floor/log/${encodeURIComponent(id)}`, { method: "DELETE", fallbackError: fail("delete the note") });
}

export async function listSpacesAction(): Promise<ActionResponse<Space[]>> {
  return apiRequest<Space[]>("/floor/spaces", { fallbackError: fail("load the rooms") });
}

export async function createSpacesAction(data: Partial<Space> & { range?: string }): Promise<ActionResponse<Space[]>> {
  return apiRequest<Space[]>("/floor/spaces", { method: "POST", body: data, fallbackError: fail("add the room") });
}

export async function updateSpaceAction(id: string, data: Partial<Omit<Space, "_id" | "outOfOrder">>): Promise<ActionResponse<Space>> {
  return apiRequest<Space>(`/floor/spaces/${encodeURIComponent(id)}`, { method: "PATCH", body: data, fallbackError: fail("save the room") });
}

export async function deleteSpaceAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/floor/spaces/${encodeURIComponent(id)}`, { method: "DELETE", fallbackError: fail("delete the room") });
}

export async function listIssuesAction(filter: { status?: string; department?: string }): Promise<ActionResponse<Issue[]>> {
  return apiRequest<Issue[]>("/floor/issues", { query: filter, fallbackError: fail("load the issues") });
}

/** FormData: title, space, location, department, outOfOrder, photo (max 150KB). */
export async function createIssueAction(form: FormData): Promise<ActionResponse<Issue>> {
  return apiRequest<Issue>("/floor/issues", { method: "POST", body: form, fallbackError: fail("report the issue") });
}

export async function fixIssueAction(id: string): Promise<ActionResponse<Issue>> {
  return apiRequest<Issue>(`/floor/issues/${encodeURIComponent(id)}/fix`, { method: "POST", fallbackError: fail("mark it fixed") });
}

export async function getChecklistAction(params: { list: ChecklistKind; date?: string; shift?: Shift }): Promise<ActionResponse<Checklist>> {
  return apiRequest<Checklist>(`/floor/checklists/${params.list}`, { query: { date: params.date, shift: params.shift }, fallbackError: fail("load the checklist") });
}

export async function addEntryAction(
  list: ChecklistKind,
  data: { item?: string; space?: string; value?: number | string | null; value2?: number | string | null; shift?: Shift | ""; done?: boolean; note?: string; date?: string },
): Promise<ActionResponse<ChecklistEntry>> {
  return apiRequest<ChecklistEntry>(`/floor/checklists/${list}/entries`, { method: "POST", body: data, fallbackError: fail("save") });
}

export async function addItemAction(list: ChecklistKind, data: Partial<ChecklistItem>): Promise<ActionResponse<ChecklistItem>> {
  return apiRequest<ChecklistItem>(`/floor/checklists/${list}/items`, { method: "POST", body: data, fallbackError: fail("add the item") });
}

export async function removeItemAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/floor/checklist-items/${encodeURIComponent(id)}`, { method: "DELETE", fallbackError: fail("remove the item") });
}

export async function listWasteAction(): Promise<ActionResponse<Waste[]>> {
  return apiRequest<Waste[]>("/floor/waste", { fallbackError: fail("load the waste list") });
}

export async function addWasteAction(data: { product: string; quantity: string; reason: WasteReason }): Promise<ActionResponse<Waste>> {
  return apiRequest<Waste>("/floor/waste", { method: "POST", body: data, fallbackError: fail("save") });
}

export async function listProductsAction(): Promise<ActionResponse<Product[]>> {
  return apiRequest<Product[]>("/floor/products", { fallbackError: fail("load the products") });
}

/** FormData: name, department, supplierName, supplierPhone, supplierEmail, photo. */
export async function saveProductAction(form: FormData, id?: string): Promise<ActionResponse<Product>> {
  return apiRequest<Product>(id ? `/floor/products/${encodeURIComponent(id)}` : "/floor/products", { method: id ? "PATCH" : "POST", body: form, fallbackError: fail("save the product") });
}

export async function deleteProductAction(id: string): Promise<ActionResponse<null>> {
  return apiRequest<null>(`/floor/products/${encodeURIComponent(id)}`, { method: "DELETE", fallbackError: fail("remove the product") });
}

export async function listRequestsAction(): Promise<ActionResponse<ProductRequest[]>> {
  return apiRequest<ProductRequest[]>("/floor/requests", { fallbackError: fail("load the order queue") });
}

export async function addRequestAction(data: { product: string; quantity?: number; note?: string }): Promise<ActionResponse<ProductRequest>> {
  return apiRequest<ProductRequest>("/floor/requests", { method: "POST", body: data, fallbackError: fail("send the request") });
}

export async function updateRequestAction(id: string, status: ProductRequest["status"]): Promise<ActionResponse<ProductRequest>> {
  return apiRequest<ProductRequest>(`/floor/requests/${encodeURIComponent(id)}`, { method: "PATCH", body: { status }, fallbackError: fail("save") });
}
