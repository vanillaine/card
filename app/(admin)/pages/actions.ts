"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { CONTENT_TAG } from "@/lib/content";

export async function updatePageDescription(formData: FormData) {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!slug || !body) return;

  await prisma.pageDescription.update({ where: { slug }, data: { body } });
  updateTag(CONTENT_TAG);
}
