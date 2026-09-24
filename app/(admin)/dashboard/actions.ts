"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin/require-admin";
import { prisma } from "@/lib/prisma";
import { CONTENT_TAG } from "@/lib/content";
import type { PointerType } from "@/generated/prisma/client";

const str = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export async function createBadge(formData: FormData) {
  await requireAdmin();
  const label = str(formData, "label");
  const value = str(formData, "value");
  if (!label || !value) return;

  const last = await prisma.badge.findFirst({ orderBy: { order: "desc" } });
  await prisma.badge.create({ data: { label, value, order: (last?.order ?? -1) + 1 } });
  updateTag(CONTENT_TAG);
}

export async function updateBadge(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const label = str(formData, "label");
  const value = str(formData, "value");
  if (!id || !label || !value) return;

  await prisma.badge.update({ where: { id }, data: { label, value } });
  updateTag(CONTENT_TAG);
}

export async function deleteBadge(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  if (!id) return;

  await prisma.badge.delete({ where: { id } });
  updateTag(CONTENT_TAG);
}

export async function moveBadge(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const direction = str(formData, "direction");

  const badges = await prisma.badge.findMany({ orderBy: { order: "asc" } });
  await swapWithNeighbor(prisma.badge, badges, id, direction);
  updateTag(CONTENT_TAG);
}

export async function createSection(formData: FormData) {
  await requireAdmin();
  const label = str(formData, "label");
  const body = str(formData, "body");
  if (!label || !body) return;

  const last = await prisma.section.findFirst({ orderBy: { order: "desc" } });
  await prisma.section.create({ data: { label, body, order: (last?.order ?? -1) + 1, required: false } });
  updateTag(CONTENT_TAG);
}

export async function updateSection(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const label = str(formData, "label");
  const body = str(formData, "body");
  if (!id || !label || !body) return;

  await prisma.section.update({ where: { id }, data: { label, body } });
  updateTag(CONTENT_TAG);
}

export async function deleteSection(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  if (!id) return;

  const section = await prisma.section.findUnique({ where: { id } });
  if (!section || section.required) return;

  await prisma.section.delete({ where: { id } });
  updateTag(CONTENT_TAG);
}

export async function moveSection(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const direction = str(formData, "direction");

  const sections = await prisma.section.findMany({ orderBy: { order: "asc" } });
  await swapWithNeighbor(prisma.section, sections, id, direction);
  updateTag(CONTENT_TAG);
}

export async function createPointer(formData: FormData) {
  await requireAdmin();
  const type = str(formData, "type") as PointerType;
  const body = str(formData, "body");
  if (!body || (type !== "byf" && type !== "dni")) return;

  const last = await prisma.pointer.findFirst({ where: { type }, orderBy: { order: "desc" } });
  await prisma.pointer.create({ data: { type, body, order: (last?.order ?? -1) + 1 } });
  updateTag(CONTENT_TAG);
}

export async function updatePointer(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const body = str(formData, "body");
  if (!id || !body) return;

  await prisma.pointer.update({ where: { id }, data: { body } });
  updateTag(CONTENT_TAG);
}

export async function deletePointer(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  if (!id) return;

  const pointer = await prisma.pointer.findUnique({ where: { id } });
  if (!pointer) return;

  const remaining = await prisma.pointer.count({ where: { type: pointer.type } });
  if (remaining <= 1) return;

  await prisma.pointer.delete({ where: { id } });
  updateTag(CONTENT_TAG);
}

export async function movePointer(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const type = str(formData, "type") as PointerType;
  const direction = str(formData, "direction");

  const pointers = await prisma.pointer.findMany({ where: { type }, orderBy: { order: "asc" } });
  await swapWithNeighbor(prisma.pointer, pointers, id, direction);
  updateTag(CONTENT_TAG);
}

type Delegate = { update: (args: { where: { id: string }; data: { order: number } }) => Promise<unknown> };

async function swapWithNeighbor<T extends { id: string; order: number }>(
  delegate: Delegate,
  rows: T[],
  id: string,
  direction: string,
) {
  const index = rows.findIndex((r) => r.id === id);
  if (index < 0) return;

  const neighborIndex = direction === "up" ? index - 1 : index + 1;
  const neighbor = rows[neighborIndex];
  if (!neighbor) return;

  const current = rows[index];
  await delegate.update({ where: { id: current.id }, data: { order: neighbor.order } });
  await delegate.update({ where: { id: neighbor.id }, data: { order: current.order } });
}
