import { getApplications } from "@/app/actions/applications";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const applications = await getApplications();
  return <DashboardClient initialApplications={applications} />;
}