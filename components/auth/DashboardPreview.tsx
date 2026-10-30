import { Logo } from "@/components/shared/Logo";
import {
  BiBell,
  BiBriefcase,
  BiBuildings,
  BiCalendar,
  BiCog,
  BiFile,
  BiGridAlt,
  BiSearch,
  BiShieldQuarter,
  BiStore,
  BiBoltCircle,
} from "react-icons/bi";

// Static, non-interactive mock of a hotel dashboard shown behind the sign-in
// card. All figures are made up — nothing is fetched, so no real data is
// shown on this public page. Hidden from screen readers.
const navItems = [
  { title: "Dashboard", icon: BiGridAlt, active: true },
  { title: "Compliance Radar", icon: BiShieldQuarter },
  { title: "Tenders", icon: BiFile },
  { title: "Jobs", icon: BiBriefcase },
  { title: "Suppliers", icon: BiStore },
  { title: "Group purchasing", icon: BiBoltCircle },
  { title: "Hotel guide", icon: BiBuildings },
  { title: "Settings", icon: BiCog },
];

const stats = [
  { title: "Expiring in 30 days", value: "3", icon: BiCalendar, color: "bg-ember-100 text-ember-600" },
  { title: "Contracts", value: "24", icon: BiFile, color: "bg-brass-100 text-brass-700" },
  { title: "Open tenders", value: "2", icon: BiShieldQuarter, color: "bg-moss-100 text-moss-600" },
  { title: "Job applications", value: "11", icon: BiBriefcase, color: "bg-sand text-ink-700" },
  { title: "Energy purchase", value: "7 / 10", icon: BiBoltCircle, color: "bg-brass-100 text-brass-700" },
];

const bars = [2, 1, 4, 2, 3, 5, 1, 2, 6, 3, 2, 4];
const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

const reminders = [
  { title: "Fire extinguisher check", meta: "Permit · in 12 days", tone: "bg-ember-100 text-ember-600" },
  { title: "Energy contract", meta: "Notice period · in 21 days", tone: "bg-brass-100 text-brass-700" },
  { title: "Lift maintenance", meta: "Contract · in 34 days", tone: "bg-sand text-ink-700" },
  { title: "Liquor licence", meta: "Permit · in 48 days", tone: "bg-sand text-ink-700" },
  { title: "Linen service", meta: "Contract · in 63 days", tone: "bg-sand text-ink-700" },
];

const DashboardPreview = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex select-none overflow-hidden bg-gray-50"
    >
      {/* Sidebar */}
      <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-white/10 bg-ink-950 lg:flex">
        <div className="flex h-16 items-center border-b border-white/10 px-5">
          <Logo tone="light" />
        </div>
        <div className="flex flex-col gap-1 px-3 py-6">
          {navItems.map(({ title, icon: Icon, active }) => (
            <div
              key={title}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                active ? "bg-brass-500/15 text-brass-400" : "text-white/65"
              }`}
            >
              <Icon className="h-5 w-5" />
              {title}
            </div>
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="flex h-10 w-72 max-w-[50%] items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-400">
            <BiSearch className="h-4 w-4" />
            Search…
          </div>
          <div className="flex items-center gap-4">
            <BiBell className="h-5 w-5 text-gray-400" />
            <div className="h-9 w-9 rounded-full bg-gray-800" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-hidden p-6">
          <div>
            <p className="font-display text-3xl text-gray-900">Hotel De Gracht</p>
            <p className="mt-1 text-sm text-gray-500">H0001 · Amsterdam</p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {stats.map(({ title, value, icon: Icon, color }) => (
              <div key={title} className="rounded-xl border border-gray-200 bg-white p-5">
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl ${color}`}>
                  <Icon />
                </span>
                <p className="mt-4 text-xs font-medium text-gray-500">{title}</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 xl:col-span-2">
              <p className="text-base font-bold text-gray-900">Year calendar · contracts &amp; permits</p>
              <div className="mt-5 flex h-56 items-end gap-3">
                {bars.map((value, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-t bg-primary/25" style={{ height: `${value * 30}px` }} />
                    <span className="text-[10px] text-gray-400">{months[index]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white">
              <p className="border-b border-gray-200 px-5 py-5 text-base font-bold text-gray-900">
                Upcoming reminders
              </p>
              <div className="divide-y divide-gray-100">
                {reminders.map(({ title, meta, tone }) => (
                  <div key={title} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">{title}</p>
                      <p className="text-xs text-gray-400">{meta}</p>
                    </div>
                    <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold ${tone}`}>30d</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
