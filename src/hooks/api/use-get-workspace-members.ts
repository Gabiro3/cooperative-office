import { getAllFarmersQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetWorkspaceMembers = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => getAllFarmersQueryFn({ workspaceId }),
    staleTime: Infinity,
  });
  return query;
};

export default useGetWorkspaceMembers;
