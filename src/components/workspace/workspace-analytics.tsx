import useWorkspaceId from "@/hooks/use-workspace-id";
import AnalyticsCard from "./common/analytics-card";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaceAnalyticsQueryFn } from "@/lib/api";

const WorkspaceAnalytics = () => {
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: () => getWorkspaceAnalyticsQueryFn(workspaceId),
    staleTime: 0,
    enabled: !!workspaceId,
  });

  const analytics = data?.analytics;

  return (
    <div className="grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
      <AnalyticsCard
        isLoading={isPending}
        title="Total Loans (Rwf)"
        value={analytics?.loansAmount || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title="Pending Loans (Rwf)"
        value={analytics?.pendingLoans || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title="Total Members"
        value={analytics?.totalMembers || 0}
      />
    </div>
  );
};

export default WorkspaceAnalytics;
