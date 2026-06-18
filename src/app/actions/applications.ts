"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getApplications() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  return prisma.application.findMany({
    where: { userId: session.user.id },
    include: {
      company: true,
      events: { orderBy: { scheduledAt: "asc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getApplicationById(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  return prisma.application.findUnique({
    where: { id, userId: session.user.id },
    include: {
      company: true,
      events: { orderBy: { scheduledAt: "asc" } },
      followups: { orderBy: { dueDate: "asc" } },
      recruiter: true,
    },
  });
}

export async function createApplication(data: {
  companyName: string;
  role: string;
  jobUrl?: string;
  notes?: string;
  appliedDate: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  // Find or create company
  let company = await prisma.company.findFirst({
    where: { name: { equals: data.companyName, mode: "insensitive" } },
  });

  if (!company) {
    company = await prisma.company.create({
      data: { name: data.companyName },
    });
  }

  await prisma.application.create({
    data: {
      userId: session.user.id,
      companyId: company.id,
      role: data.role,
      jobUrl: data.jobUrl || null,
      notes: data.notes || null,
      appliedDate: new Date(data.appliedDate),
      status: "APPLIED",
    },
  });

  revalidatePath("/dashboard");
}

export async function updateApplication(id: string, data: {
  role?: string;
  jobUrl?: string;
  notes?: string;
  status?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.application.update({
    where: { id, userId: session.user.id },
    data: {
      ...(data.role && { role: data.role }),
      ...(data.jobUrl !== undefined && { jobUrl: data.jobUrl }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.status && { status: data.status as any }),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/applications/${id}`);
}

export async function deleteApplication(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.application.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/dashboard");
}

export async function updateApplicationStatus(id: string, status: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.application.update({
    where: { id, userId: session.user.id },
    data: { status: status as any },
  });

  revalidatePath("/dashboard");
}

export async function getCompanies() {
  return prisma.company.findMany({ orderBy: { name: "asc" } });
}

export async function createEvent(data: {
  applicationId: string;
  type: string;
  scheduledAt: string;
  durationMins?: number;
  location?: string;
  notes?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.event.create({
    data: {
      applicationId: data.applicationId,
      type: data.type as any,
      scheduledAt: new Date(data.scheduledAt),
      durationMins: data.durationMins || null,
      location: data.location || null,
      notes: data.notes || null,
    },
  });

  revalidatePath(`/dashboard/applications/${data.applicationId}`);
  revalidatePath("/dashboard");
}

export async function deleteEvent(eventId: string, applicationId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.event.delete({ where: { id: eventId } });

  revalidatePath(`/dashboard/applications/${applicationId}`);
  revalidatePath("/dashboard");
}

export async function getUpcomingEvents() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  return prisma.event.findMany({
    where: {
      application: { userId: session.user.id },
      scheduledAt: { gte: new Date() },
      completed: false,
    },
    include: {
      application: { include: { company: true } },
    },
    orderBy: { scheduledAt: "asc" },
    take: 20,
  });
}

export async function markEventComplete(eventId: string, applicationId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.event.update({
    where: { id: eventId },
    data: { completed: true },
  });

  revalidatePath(`/dashboard/applications/${applicationId}`);
}

export async function createFollowup(data: {
  applicationId: string;
  dueDate: string;
  message?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.followup.create({
    data: {
      applicationId: data.applicationId,
      dueDate: new Date(data.dueDate),
      message: data.message || null,
    },
  });

  revalidatePath(`/dashboard/applications/${data.applicationId}`);
  revalidatePath("/dashboard/followups");
}

export async function toggleFollowup(id: string, done: boolean, applicationId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.followup.update({
    where: { id },
    data: { done },
  });

  revalidatePath(`/dashboard/applications/${applicationId}`);
  revalidatePath("/dashboard/followups");
}

export async function deleteFollowup(id: string, applicationId: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.followup.delete({ where: { id } });

  revalidatePath(`/dashboard/applications/${applicationId}`);
  revalidatePath("/dashboard/followups");
}

export async function getAllFollowups() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  return prisma.followup.findMany({
    where: {
      application: { userId: session.user.id },
    },
    include: {
      application: { include: { company: true } },
    },
    orderBy: { dueDate: "asc" },
  });
}

export async function getStats() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    include: { events: true },
    orderBy: { appliedDate: "asc" },
  });

  const total = applications.length;
  const byStatus = applications.reduce((acc: Record<string, number>, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const responded = applications.filter((a) =>
    ["OA","PHONE_SCREEN","TECHNICAL","HR","ONSITE","OFFER","REJECTED"].includes(a.status)
  ).length;

  const offers = byStatus["OFFER"] || 0;
  const rejected = byStatus["REJECTED"] || 0;

  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;
  const offerRate = total > 0 ? Math.round((offers / total) * 100) : 0;

  // Applications over time (by month)
  const byMonth: Record<string, number> = {};
  applications.forEach((app) => {
    const month = new Date(app.appliedDate).toLocaleString("en-GB", { month: "short", year: "2-digit" });
    byMonth[month] = (byMonth[month] || 0) + 1;
  });

  const timeline = Object.entries(byMonth).map(([month, count]) => ({ month, count }));

  const statusChart = Object.entries(byStatus).map(([status, count]) => ({
    status: status.replace("_", " "),
    count,
  }));

  return {
    total,
    responded,
    offers,
    rejected,
    responseRate,
    offerRate,
    timeline,
    statusChart,
    byStatus,
  };
}