import { getApplicationById } from "@/app/actions/applications";
import { notFound } from "next/navigation";
import ApplicationDetail from "@/components/ApplicationDetail";

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = await getApplicationById(id);
  if (!application) notFound();

  return <ApplicationDetail application={application} />;
}