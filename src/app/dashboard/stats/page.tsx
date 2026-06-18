import { getStats } from "@/app/actions/applications";
import StatsClient from "@/components/StatsClient";

export default async function StatsPage() {
  const stats = await getStats();
  return <StatsClient stats={stats} />;
}