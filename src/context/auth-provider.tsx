/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { UserType, WorkspaceType } from "@/types/api.type";
import useGetWorkspaceQuery from "@/hooks/api/use-get-workspace";
import { useNavigate } from "react-router-dom";
import usePermissions from "@/hooks/use-permissions";
import { PermissionType } from "@/constant";

// Define the context shape
type AuthContextType = {
  user?: UserType;
  workspace?: WorkspaceType;
  hasPermission: (permission: PermissionType) => boolean;
  error: any;
  isLoading: boolean;
  isFetching: boolean;
  workspaceLoading: boolean;
  refetchAuth: () => void;
  refetchWorkspace: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Function to retrieve user from localStorage
const getUserFromLocalStorage = (): UserType | null => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

// Function to retrieve workspace ID from localStorage
const getWorkspaceIdFromLocalStorage = (): string | null => {
  const storedUser = getUserFromLocalStorage();
  return storedUser?.currentWorkspace?._id ?? null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | undefined>(getUserFromLocalStorage() || undefined);
  const workspaceId = useWorkspaceId() || getWorkspaceIdFromLocalStorage() || '';

  // Fetch workspace details if workspaceId exists
  const {
    data: workspaceData,
    isLoading: workspaceLoading,
    error: workspaceError,
    refetch: refetchWorkspace,
  } = useGetWorkspaceQuery(workspaceId);

  const workspace = workspaceData?.workspace;

  useEffect(() => {
    if (workspaceError?.errorCode === "ACCESS_UNAUTHORIZED") {
      navigate("/"); // Redirect if the user is not authorized
    }
  }, [navigate, workspaceError]);

  const permissions = usePermissions(user, workspace);

  const hasPermission = (permission: PermissionType): boolean => {
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workspace,
        hasPermission,
        error: workspaceError,
        isLoading: false, // No API request for user
        isFetching: false,
        workspaceLoading,
        refetchAuth: () => {
          const updatedUser = getUserFromLocalStorage();
          setUser(updatedUser || undefined);
        },
        refetchWorkspace,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
