"use client";

import { deleteArticleImageAction, getArticleAction, updateArticleAction, uploadArticleImageAction, type ArticleInput } from "@/app/actions/article";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { uploadAfterSave } from "@/lib/uploadAfterSave";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import StoryForm, { EMPTY_STORY } from "./StoryForm";

/** "Edit story" page — /stories/edit?id=… */
const StoryEdit = () => {
  const t = useTranslations("Stories");
  const tc = useTranslations("Common");
  const router = useRouter();
  const id = useSearchParams().get("id") ?? "";
  const { data: story, loading, setData } = useApiData(getArticleAction, id);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: ArticleInput, image: File | null) => {
    setSubmitting(true);
    const res = await updateArticleAction(id, data);
    if (!res.ok) {
      toast.error(res.error || tc("error"));
      setSubmitting(false);
      return;
    }
    const uploadError = await uploadAfterSave(image, (fd) => uploadArticleImageAction(id, fd));
    if (uploadError) toast.error(`${tc("photoNotSaved")} ${uploadError}`);
    toast.success(t("updated", { title: data.title }));
    router.push(`/admin/stories/${id}`);
  };

  const removeImage = async () => {
    if (!story || !window.confirm(tc("confirmRemovePhoto"))) return;
    const res = await deleteArticleImageAction(id);
    if (res.ok) {
      setData({ ...story, image: "" });
      toast.success(tc("photoRemoved"));
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("editTitle")} description={story?.title} back={{ href: id ? `/admin/stories/${id}` : "/admin/stories", label: t("back") }} />
      {loading ? (
        <FormSkeleton />
      ) : story ? (
        <StoryForm
          initial={{
            ...EMPTY_STORY,
            ...story,
            body: story.body ?? "",
            publishedAt: story.publishedAt ? story.publishedAt.slice(0, 10) : "",
          }}
          currentImage={story.image}
          onRemoveImage={removeImage}
          submitting={submitting}
          submitLabel={tc("saveChanges")}
          cancelHref={`/admin/stories/${id}`}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className="rounded border border-gray-200 bg-white py-20 text-center text-sm text-gray-500">{t("notFound")}</div>
      )}
    </div>
  );
};

export default StoryEdit;
