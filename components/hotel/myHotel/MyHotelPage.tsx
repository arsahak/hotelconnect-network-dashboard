"use client";

import { getMyHotelAction, type MyHotel } from "@/app/actions/myHotel";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { outlineButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { WEBSITE_URL } from "@/lib/site";
import { useTranslations } from "next-intl";
import { BiLinkExternal } from "react-icons/bi";
import { CompanySection } from "./CompanySection";
import { EmailsSection } from "./EmailsSection";
import { FacilitiesSection } from "./FacilitiesSection";
import { GuideSection } from "./GuideSection";
import { NotificationChannelsSection } from "./NotificationChannelsSection";
import { StaffLoginSection } from "./StaffLoginSection";

/** "My hotel": everything from the onboarding, editable any time, plus the staff login. */
const MyHotelPage = () => {
  const t = useTranslations("MyHotel");
  const tc = useTranslations("Common");
  const { data: hotel, loading, error, setData } = useApiData(getMyHotelAction, null);
  const saved = (updated: MyHotel) => setData(updated);

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("title")}
        description={hotel ? `${hotel.name} · ${hotel.memberNumber}` : undefined}
        actions={
          hotel?.isActive && (
            <a href={`${WEBSITE_URL}/hotels?q=${encodeURIComponent(hotel.name)}`} target="_blank" rel="noopener noreferrer" className={outlineButtonClass}>
              <BiLinkExternal size={16} /> {tc("viewOnWebsite")}
            </a>
          )
        }
      />
      {loading ? (
        <FormSkeleton />
      ) : hotel ? (
        <>
          <CompanySection hotel={hotel} onSaved={saved} />
          <FacilitiesSection key={`f-${hotel.updatedAt ?? ""}`} hotel={hotel} onSaved={saved} />
          <GuideSection hotel={hotel} onSaved={saved} />
          <EmailsSection hotel={hotel} onSaved={saved} />
          <NotificationChannelsSection key={`n-${hotel.updatedAt ?? ""}`} hotel={hotel} onSaved={saved} />
          <StaffLoginSection />
        </>
      ) : (
        <p className="rounded border border-gray-200 bg-white py-16 text-center text-sm text-gray-500">{error}</p>
      )}
    </div>
  );
};

export default MyHotelPage;
