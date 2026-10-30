import type { IconType } from "react-icons";
import {
  BiBookOpen,
  BiBookBookmark,
  BiBell,
  BiBuildingHouse,
  BiCheckShield,
  BiFile,
  BiWrench,
  BiBriefcase,
  BiReceipt,
  BiShoppingBag,
  BiBuildings,
  BiCog,
  BiGroup,
  BiHome,
  BiLink,
  BiPlusCircle,
  BiPurchaseTagAlt,
  BiStore,
  BiUserCircle,
  BiUserPlus,
  BiWallet,
  BiBroadcast,
} from "react-icons/bi";
import { canAccess, type UserRole } from "./access";

// Sidebar + topbar search. `key` points to the Nav.items.<key> message
// (title + description) in messages/en.json and messages/nl.json.
// Who sees an item comes from ROUTE_ACCESS, so the menu and the proxy agree.

export interface SubNavItem {
  key: string;
  href: string;
  icon: IconType;
}

export interface NavItem {
  key: string;
  href: string;
  icon: IconType;
  sub?: SubNavItem[];
}

export interface NavSection {
  /** Nav.sections.<key>; omit for the top group. */
  key?: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    items: [{ key: "dashboard", href: "/dashboard", icon: BiHome }],
  },
  {
    key: "compliance",
    items: [
      {
        key: "contracts",
        href: "/hotel/contracts",
        icon: BiFile,
        sub: [
          { key: "contractsAll", href: "/hotel/contracts", icon: BiFile },
          { key: "contractsAdd", href: "/hotel/contracts/add", icon: BiPlusCircle },
        ],
      },
      {
        key: "permits",
        href: "/hotel/permits",
        icon: BiCheckShield,
        sub: [
          { key: "permitsAll", href: "/hotel/permits", icon: BiCheckShield },
          { key: "permitsAdd", href: "/hotel/permits/add", icon: BiPlusCircle },
        ],
      },
      {
        key: "faults",
        href: "/hotel/faults",
        icon: BiWrench,
        sub: [
          { key: "faultsAll", href: "/hotel/faults", icon: BiWrench },
          { key: "faultsAdd", href: "/hotel/faults/add", icon: BiPlusCircle },
        ],
      },
      { key: "kennisbank", href: "/hotel/kennisbank", icon: BiBookBookmark },
    ],
  },
  {
    // Hotel: send tenders. Supplier: the requests they were invited to.
    key: "purchasing",
    items: [
      {
        key: "tenders",
        href: "/hotel/tenders",
        icon: BiReceipt,
        sub: [
          { key: "tendersAll", href: "/hotel/tenders", icon: BiReceipt },
          { key: "tendersAdd", href: "/hotel/tenders/add", icon: BiPlusCircle },
        ],
      },
      { key: "supplierTenders", href: "/supplier/tenders", icon: BiReceipt },
      { key: "collectivePurchasing", href: "/hotel/purchasing", icon: BiShoppingBag },
    ],
  },
  {
    key: "company",
    items: [{ key: "supplierProfile", href: "/supplier/profile", icon: BiStore }],
  },
  {
    key: "hotel",
    items: [
      { key: "myHotel", href: "/hotel/my-hotel", icon: BiBuildingHouse },
      {
        key: "hotelJobs",
        href: "/hotel/jobs",
        icon: BiBriefcase,
        sub: [
          { key: "hotelJobsAll", href: "/hotel/jobs", icon: BiBriefcase },
          { key: "hotelJobsAdd", href: "/hotel/jobs/add", icon: BiPlusCircle },
        ],
      },
      {
        key: "hotelVouchers",
        href: "/hotel/vouchers",
        icon: BiPurchaseTagAlt,
        sub: [
          { key: "hotelVouchersAll", href: "/hotel/vouchers", icon: BiPurchaseTagAlt },
          { key: "hotelVouchersAdd", href: "/hotel/vouchers/add", icon: BiPlusCircle },
        ],
      },
      {
        key: "links",
        href: "/hotel/links",
        icon: BiLink,
        sub: [
          { key: "linksAll", href: "/hotel/links", icon: BiLink },
          { key: "linksAdd", href: "/hotel/links/add", icon: BiPlusCircle },
        ],
      },
    ],
  },
  {
    key: "network",
    items: [
      { key: "registrations", href: "/admin/registrations", icon: BiUserPlus },
      {
        key: "hotels",
        href: "/admin/hotels",
        icon: BiBuildings,
        sub: [
          { key: "hotelsAll", href: "/admin/hotels", icon: BiBuildings },
          { key: "hotelsAdd", href: "/admin/hotels/add", icon: BiPlusCircle },
        ],
      },
      {
        key: "suppliers",
        href: "/admin/suppliers",
        icon: BiStore,
        sub: [
          { key: "suppliersAll", href: "/admin/suppliers", icon: BiStore },
          { key: "suppliersAdd", href: "/admin/suppliers/add", icon: BiPlusCircle },
        ],
      },
      {
        key: "adminPurchasing",
        href: "/admin/purchasing",
        icon: BiShoppingBag,
        sub: [
          { key: "adminPurchasingAll", href: "/admin/purchasing", icon: BiShoppingBag },
          { key: "adminPurchasingAdd", href: "/admin/purchasing/add", icon: BiPlusCircle },
        ],
      },
    ],
  },
  {
    key: "website",
    items: [
      {
        key: "jobs",
        href: "/admin/jobs",
        icon: BiBriefcase,
        sub: [
          { key: "jobsAll", href: "/admin/jobs", icon: BiBriefcase },
          { key: "jobsAdd", href: "/admin/jobs/add", icon: BiPlusCircle },
        ],
      },
      {
        key: "vouchers",
        href: "/admin/vouchers",
        icon: BiPurchaseTagAlt,
        sub: [
          { key: "vouchersAll", href: "/admin/vouchers", icon: BiPurchaseTagAlt },
          { key: "vouchersAdd", href: "/admin/vouchers/add", icon: BiPlusCircle },
        ],
      },
      {
        key: "stories",
        href: "/admin/stories",
        icon: BiBookOpen,
        sub: [
          { key: "storiesAll", href: "/admin/stories", icon: BiBookOpen },
          { key: "storiesAdd", href: "/admin/stories/add", icon: BiPlusCircle },
        ],
      },
    ],
  },
  {
    // Facturen and sponsored spots (hotel + supplier); the admin overview.
    key: "billing",
    items: [
      { key: "hotelInvoices", href: "/hotel/invoices", icon: BiWallet },
      { key: "supplierInvoices", href: "/supplier/invoices", icon: BiWallet },
      { key: "hotelAdvertising", href: "/hotel/advertising", icon: BiBroadcast },
      { key: "supplierAdvertising", href: "/supplier/advertising", icon: BiBroadcast },
      { key: "adminInvoices", href: "/admin/invoices", icon: BiWallet },
      { key: "adminAdvertising", href: "/admin/advertising", icon: BiBroadcast },
    ],
  },
  {
    key: "administration",
    items: [
      {
        key: "team",
        href: "/admin/team",
        icon: BiGroup,
        sub: [
          { key: "teamAll", href: "/admin/team", icon: BiGroup },
          { key: "teamAdd", href: "/admin/team/add", icon: BiPlusCircle },
        ],
      },
    ],
  },
  {
    key: "account",
    items: [
      { key: "notifications", href: "/notifications", icon: BiBell },
      { key: "profile", href: "/profile", icon: BiUserCircle },
      { key: "settings", href: "/settings", icon: BiCog },
    ],
  },
];

// Same rule as the proxy, so the menu never shows a page the role can't open.
const allowed = (href: string, role: UserRole) => canAccess(href, role);

/** The menu as one role sees it: hidden items and empty sections removed. */
export function navigationFor(role: UserRole): NavSection[] {
  return navigation
    .map((section) => ({
      ...section,
      items: section.items
        .filter((item) => allowed(item.href, role))
        .map((item) => ({
          ...item,
          sub: item.sub?.filter((sub) => allowed(sub.href, role)),
        })),
    }))
    .filter((section) => section.items.length > 0);
}

/** Every page a role can open, flat — for the topbar search. */
export function pagesFor(role: UserRole): SubNavItem[] {
  const seen = new Set<string>();
  return navigationFor(role)
    .flatMap((section) => section.items.flatMap((item) => [item, ...(item.sub ?? [])]))
    .filter((page) => (seen.has(page.href) ? false : (seen.add(page.href), true)));
}
