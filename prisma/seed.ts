import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: 'postgresql://postgres:12345678@localhost:5433/recruiting_crm' });
const prisma = new PrismaClient({ adapter });

const AppStatus = {
  WISHLIST: "WISHLIST", APPLIED: "APPLIED", OA: "OA",
  PHONE_SCREEN: "PHONE_SCREEN", TECHNICAL: "TECHNICAL",
  HR: "HR", ONSITE: "ONSITE", OFFER: "OFFER",
  REJECTED: "REJECTED", WITHDRAWN: "WITHDRAWN"
} as const;

const EventType = {
  OA: "OA", PHONE_SCREEN: "PHONE_SCREEN", TECHNICAL: "TECHNICAL",
  HR_ROUND: "HR_ROUND", ONSITE: "ONSITE", OFFER_CALL: "OFFER_CALL", OTHER: "OTHER"
} as const;


async function main() {
  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Aaryan",
      password: "hashed_later", // will wire bcrypt in Phase 2
    },
  });

  // Companies
  const companies = await Promise.all([
    prisma.company.create({ data: { name: "Google", domain: "google.com" } }),
    prisma.company.create({ data: { name: "Microsoft", domain: "microsoft.com" } }),
    prisma.company.create({ data: { name: "Stripe", domain: "stripe.com" } }),
  ]);

  // Applications
  const app1 = await prisma.application.create({
    data: {
      userId: user.id,
      companyId: companies[0].id,
      role: "Software Engineer Intern",
      status: AppStatus.TECHNICAL,
      appliedDate: new Date("2025-08-01"),
      jobUrl: "https://careers.google.com",
      notes: "Referred by college senior",
    },
  });

  const app2 = await prisma.application.create({
    data: {
      userId: user.id,
      companyId: companies[1].id,
      role: "SDE Intern",
      status: AppStatus.OA,
      appliedDate: new Date("2025-08-10"),
    },
  });

  await prisma.application.create({
    data: {
      userId: user.id,
      companyId: companies[2].id,
      role: "Backend Engineer Intern",
      status: AppStatus.APPLIED,
      appliedDate: new Date("2025-08-15"),
    },
  });

  // Events
  await prisma.event.create({
    data: {
      applicationId: app1.id,
      type: EventType.TECHNICAL,
      scheduledAt: new Date("2025-09-05T10:00:00Z"),
      durationMins: 60,
      location: "https://meet.google.com/xyz",
      notes: "DSA round, expect Leetcode medium-hard",
    },
  });

  await prisma.event.create({
    data: {
      applicationId: app2.id,
      type: EventType.OA,
      scheduledAt: new Date("2025-08-25T14:00:00Z"),
      durationMins: 90,
      notes: "HackerRank OA — 2 questions",
    },
  });

  // Follow-up
  await prisma.followup.create({
    data: {
      applicationId: app1.id,
      dueDate: new Date("2025-09-10"),
      message: "Hi [Recruiter], just following up on the technical round...",
    },
  });

  console.log("✅ Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());