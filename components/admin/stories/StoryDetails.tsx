"use client";

import { deleteArticleAction, getArticleAction, updateArticleAction } from "@/app/actions/article";
import { cardClass, dangerButtonClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Thumb } from "@/components/shared/Thumb";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { WEBSITE_URL } from "@/lib/site";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiCheckCircle, BiHide, BiLinkExternal, BiPencil, BiTrash } from "react-icons/bi";

/** Story preview page — /stories/[id], with quick publish / unpublish. */
const StoryDetails = ({ id }: { id: string }) => {
  const t = useTranslations("Stories");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const optionLabel = useOptionLabel();
  const router = useRouter();
  const { data: story, loading, reload } = useApiData(getArticleAction, id);
  const [changing, setChanging] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
        <div className="h-32 animate-pulse rounded border border-gray-200 bg-white" />
        <div className="h-96 animate-pulse rounded border border-gray-200 bg-white" />
      </div>
    );
  }
  if (!story) {
    return (
      <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
        <PageHeader title={t("notFound")} back={{ href: "/admin/stories", label: t("back") }} />
      </div>
    );
  }

  const togglePublished = async () => {
    setChanging(true);
    const status = story.status === "published" ? "draft" : "published";
    const res = await updateArticleAction(story._id, { status });
    if (res.ok) {
      toast.success(t(`statusChanged.${status}`));
      reload();
    } else toast.error(res.error || tc("error"));
    setChanging(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(t("confirmDelete", { title: story.title }))) return;
    const res = await deleteArticleAction(story._id);
    if (res.ok) {
      toast.success(t("deleted", { title: story.title }));
      router.push("/admin/stories");
    } else toast.error(res.error || tc("error"));
  };

  const live = story.status === "published" && story.publishedAt && new Date(story.publishedAt) <= new Date();

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("preview")}
        back={{ href: "/admin/stories", label: t("back") }}
        actions={
          <>
            {live && (
              <a href={`${WEBSITE_URL}/stories/${story.slug}`} target="_blank" rel="noopener noreferrer" className={outlineButtonClass}>
                <BiLinkExternal size={16} /> {tc("viewOnWebsite")}
              </a>
            )}
            <button type="button" disabled={changing} onClick={togglePublished} className={story.status === "published" ? outlineButtonClass : primaryButtonClass}>
              {story.status === "published" ? <BiHide size={16} /> : <BiCheckCircle size={16} />}
              {story.status === "published" ? t("actions.unpublish") : t("actions.publish")}
            </button>
            <Link href={`/admin/stories/edit?id=${story._id}`} className={outlineButtonClass}>
              <BiPencil size={16} /> {tc("edit")}
            </Link>
            <button type="button" onClick={handleDelete} className={dangerButtonClass}>
              <BiTrash size={16} /> {tc("delete")}
            </button>
          </>
        }
      />

      <article className={`${cardClass} mx-auto w-full max-w-4xl`}>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <StatusBadge tone={story.status === "published" ? "green" : "brass"}>{t(`statuses.${story.status}`)}</StatusBadge>
          <span>{optionLabel("articleKinds", story.kind)}</span>·<span>{t("minutes", { count: story.readingMinutes })}</span>
          {story.publishedAt && (
            <>
              ·<span>{format.dateTime(new Date(story.publishedAt), { dateStyle: "long" })}</span>
            </>
          )}
        </div>
        <h1 className="heading-strong mt-4 font-display text-4xl leading-tight text-gray-950">{story.title}</h1>
        {story.excerpt && <p className="mt-3 text-lg text-gray-600">{story.excerpt}</p>}
        {story.image && (
          <div className="relative mt-6 aspect-[21/9] overflow-hidden rounded-lg bg-gray-50">
            <Thumb src={story.image} alt="" />
          </div>
        )}
        <div
          className="prose prose-stone mt-8 max-w-none prose-headings:font-display prose-headings:font-normal prose-a:text-primary-dark"
          // HTML cleaned by the API when it was saved.
          dangerouslySetInnerHTML={{ __html: story.body ?? "" }}
        />
      </article>
    </div>
  );
};

export default StoryDetails;
