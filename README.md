# HotelConnect Dashboard

The private dashboard of HotelConnect Network (Next.js). One sign-in for every
user; the role decides the menu:

- **superadmin / admin** — the HotelConnect team (beheerder)
- **hotel_manager** — full access to their hotel
- **hotel_staff** — the hotel's limited staff login
- **supplier** — a supplier's dashboard

The dashboard is in **English (default) and Dutch**. Texts live in
`messages/en.json` and `messages/nl.json`; the chosen language is kept in the
`hc-locale` cookie (`i18n/request.ts`). Add every new text to both files.

## How a feature is built

1. `app/actions/<feature>.ts` — server actions that call the API (`lib/api.ts`)
2. `components/<feature>/` — `XList`, `XForm`, `XAdd`, `XEdit`, `XDetails`
3. `app/(dashboard)/<feature>/` — `page.tsx` (list), `add/`, `edit/` (`?id=`), `[id]/` (details)
4. Add the menu item in `config/navigation.tsx` and who may open it in `config/access.ts`

The Team pages (`/team`) are the reference example. Admin modules built this way: Hotels, Suppliers, Jobs, Vouchers and Stories.

Shared pieces: `lib/useApiData.ts` (load + reload), `lib/useOptions.ts` (regions/categories and their Dutch labels in `messages/*.json` → `Options`), `components/shared/form/*` (Field, ImageField, ChipSelect, Toggle), `ListToolbar`, `RowActions`, `TableStatus`.

`NEXT_PUBLIC_WEBSITE_URL` (default `http://localhost:3000`) is used for "View on website" links.

Brand: brass primary (`#9f7b3b`), warm ink text, cream/sand surfaces, Poppins +
Gilda Display — the same as the public website.

## Run locally

```bash
npm install
npm run dev
```

Needs the backend running (`NEXT_PUBLIC_API_URL`, default `http://localhost:8000`).
