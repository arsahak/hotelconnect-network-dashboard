"use client";

import { createArticleAction, uploadArticleImageAction, type ArticleInput } from "@/app/actions/article";
import { PageHeader } from "@/components/shared/PageHeader";
import { uploadAfterSave } from "@/lib/uploadAfterSave";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import StoryForm from "./StoryForm";

/** "Write a story" page. */
const StoryAdd = () => {
  const t = useTranslations("Stories");
  const tc = useTranslations("Common");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: ArticleInput, image: File | null) => {
    setSubmitting(true);
    const res = await createArticleAction(data);
    if (!res.ok || !res.data) {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
      return;
    }
    const story = res.data;
    const uploadError = await uploadAfterSave(image, (fd) => uploadArticleImageAction(story._id, fd));
    if (uploadError) toast.error(`${tc("photoNotSaved")} ${uploadError}`);
    toast.success(t("created", { title: story.title }));
    router.push(`/admin/stories/${story._id}`);
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("addTitle")} description={t("addDescription")} back={{ href: "/admin/stories", label: t("back") }} />
      <StoryForm submitting={submitting} submitLabel={t("save")} cancelHref="/admin/stories" onSubmit={handleSubmit} />
    </div>
  );
};

export default StoryAdd;
