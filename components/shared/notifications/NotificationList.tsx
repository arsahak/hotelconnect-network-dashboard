"use client";

import { listNotificationsAction, markAllReadAction, markReadAction, type AppNotification, type NotificationType } from "@/app/actions/notification";
import { outlineButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { PushToggle } from "./PushToggle";
import { useApiData } from "@/lib/useApiData";
import { cn } from "@/lib/utils";
import { useFormatter, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiBriefcase, BiCheckDouble, BiCheckShield, BiCog, BiPurchaseTagAlt, BiReceipt, BiWrench } from "react-icons/bi";
import type { IconType } from "react-icons";

const ICONS: Record<NotificationType, IconType> = {
  compliance: BiCheckShield,
  tender: BiReceipt,
  vacancy: BiBriefcase,
  fault: BiWrench,
  system: BiCog,
  advertising: BiPurchaseTagAlt,
};

/** The inbox — /notifications (briefing §3.12, §4.4). Opening a melding marks it read. */
const NotificationList = () => {
  const t = useTranslations("Notifications");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const router = useRouter();
  const [onlyUnread, setOnlyUnread] = useState(false);
  const { data, loading, reload } = useApiData(listNotificationsAction, { unread: onlyUnread });
  const items = data?.items ?? [];

  const open = async (n: AppNotification) => {
    if (!n.readAt) await markReadAction(n._id);
    if (n.link) router.push(n.link);
    else reload();
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <button
            type="button"
            disabled={!data?.unread}
            onClick={async () => {
              const res = await markAllReadAction();
              if (res.ok) reload();
              else toast.error(res.error || tc("error"));
            }}
            className={outlineButtonClass}
          >
            <BiCheckDouble size={16} /> {t("markAllRead")}
          </button>
        }
      />

      <PushToggle />

      <div className="flex gap-2">
        {[false, true].map((unread) => (
          <button
            key={String(unread)}
            type="button"
            aria-pressed={onlyUnread === unread}
            onClick={() => setOnlyUnread(unread)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium",
              onlyUnread === unread ? "border-ink-950 bg-ink-950 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
            )}
          >
            {unread ? t("unreadOnly", { count: data?.unread ?? 0 }) : t("all")}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded border border-gray-200 bg-white">
        {loading ? (
          <div className="h-40 animate-pulse bg-gray-50" />
        ) : items.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500">{onlyUnread ? t("noUnread") : t("empty")}</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map((n) => {
              const Icon = ICONS[n.type];
              return (
                <li key={n._id}>
                  <button type="button" onClick={() => open(n)} className={cn("flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50", !n.readAt && "bg-brass-100/30")}>
                    <span className={cn("mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full", n.readAt ? "bg-gray-100 text-gray-500" : "bg-brass-100 text-brass-600")}>
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className={cn("truncate text-sm text-gray-900", !n.readAt && "font-semibold")}>{n.title}</span>
                        {!n.readAt && <span className="h-2 w-2 shrink-0 rounded-full bg-ember-600" aria-label={t("new")} />}
                      </span>
                      {n.body && <span className="mt-0.5 block text-sm text-gray-600">{n.body}</span>}
                      <span className="mt-1 block text-xs text-gray-400">
                        {t(`types.${n.type}`)} · {format.relativeTime(new Date(n.createdAt))}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
