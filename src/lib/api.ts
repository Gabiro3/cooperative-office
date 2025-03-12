import API from "./axios-client";
import {
  AllMembersInWorkspaceResponseType,
  AllProjectPayloadType,
  AllProjectResponseType,
  AllTaskPayloadType,
  AllTaskResponseType,
  AnalyticsResponseType,
  ChangeWorkspaceMemberRoleType,
  CreateProjectPayloadType,
  CreateTaskPayloadType,
  CreateWorkspaceResponseType,
  EditProjectPayloadType,
  ProjectByIdPayloadType,
  ProjectResponseType,
} from "../types/api.type";
import {
  AllWorkspaceResponseType,
  CreateWorkspaceType,
  CurrentUserResponseType,
  LoginResponseType,
  loginType,
  registerType,
  WorkspaceByIdResponseType,
  EditWorkspaceType,
  UpdateTaskPayloadType,
} from "@/types/api.type";

export const loginMutationFn = async (
  data: loginType
): Promise<LoginResponseType> => {
  const response = await API.post("/auth/login", data);
  
  // Extract only the user object from the response
  const user = response.data.user;
  console.log(user)

  // Store the user object in local storage
  localStorage.setItem("user", JSON.stringify(user));

  return response.data;
};


export const registerMutationFn = async (data: registerType) =>
  await API.post("/auth/register", data);

export const logoutMutationFn = async () => {
  await API.post("/auth/logout");

  // Remove user data from local storage on logout
  localStorage.removeItem("user");
};
export const getCurrentUserQueryFn = async (): Promise<CurrentUserResponseType> => {
  // Retrieve user details from local storage
  const user = localStorage.getItem("user");

  if (user) {
    return JSON.parse(user); // Parse JSON before returning
  }

  throw new Error("No user found in local storage");
};



//********* WORKSPACE ****************
//************* */

// Helper function to get the user from localStorage
const getUserFromLocalStorage = () => {
  const storedUser = localStorage.getItem("user");
  console.log(storedUser)
  return storedUser ? JSON.parse(storedUser) : null;
};

// Create Workspace with user object in request body
export const createWorkspaceMutationFn = async (
  data: CreateWorkspaceType
): Promise<CreateWorkspaceResponseType> => {
  const user = getUserFromLocalStorage();
  const userId = user?._id; // Extract the user ID

  if (!userId) {
    throw new Error("Unauthorized: User ID not found.");
  }

  const response = await API.post(`/workspace/create/new`, {
    ...data,
    userId, // Pass userId in the request body
  });

  return response.data;
};


// Edit Workspace with user object
export const editWorkspaceMutationFn = async ({
  workspaceId,
  data,
}: EditWorkspaceType) => {
  const user = getUserFromLocalStorage();
  const response = await API.put(`/workspace/update/${workspaceId}`, {
    ...data,
    user,
  });
  return response.data;
};

// Get all workspaces where user is a member
export const getAllWorkspacesUserIsMemberQueryFn =
  async (): Promise<AllWorkspaceResponseType> => {
    const response = await API.get(`/workspace/all`);
    return response.data;
  };


export const getWorkspaceByIdQueryFn = async (
  workspaceId: string
): Promise<WorkspaceByIdResponseType> => {
  const response = await API.get(`/workspace/${workspaceId}`);
  return response.data;
};

export const getMembersInWorkspaceQueryFn = async (
  workspaceId: string
): Promise<AllMembersInWorkspaceResponseType> => {
  const response = await API.get(`/workspace/members/${workspaceId}`);
  return response.data;
};

export const getWorkspaceAnalyticsQueryFn = async (
  workspaceId: string
): Promise<AnalyticsResponseType> => {
  const response = await API.get(`/workspace/analytics/${workspaceId}`);
  return response.data;
};

export const changeWorkspaceMemberRoleMutationFn = async ({
  workspaceId,
  data,
}: ChangeWorkspaceMemberRoleType) => {
  const response = await API.put(
    `/workspace/change/member/role/${workspaceId}`,
    data
  );
  return response.data;
};

export const deleteWorkspaceMutationFn = async (
  workspaceId: string
): Promise<{
  message: string;
  currentWorkspace: string;
}> => {
  const response = await API.delete(`/workspace/delete/${workspaceId}`);
  return response.data;
};

//*******MEMBER ****************

export const invitedUserJoinWorkspaceMutationFn = async (
  iniviteCode: string
): Promise<{
  message: string;
  workspaceId: string;
}> => {
  const response = await API.post(`/member/workspace/${iniviteCode}/join`);
  return response.data;
};

export const invitedOfficerJoinCooperativeMutationFn = async (
  workspaceId: string,
  officerId: string
): Promise<{
  message: string;
  workspaceId: string;
}> => {
  const response = await API.post(`/workspace/officers/new/${workspaceId}`, {
    officerId: officerId, // Send officerId as 'officerid' in the request body
  });
  console.log(response.data)
  return response.data;
};

//********* */
//********* PROJECTS
export const createProjectMutationFn = async ({
  workspaceId,
  data,
}: CreateProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.post(
    `/project/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

export const editProjectMutationFn = async ({
  projectId,
  workspaceId,
  data,
}: EditProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.put(
    `/project/${projectId}/workspace/${workspaceId}/update`,
    data
  );
  return response.data;
};

export const getProjectsInWorkspaceQueryFn = async ({
  workspaceId,
  pageSize = 10,
  pageNumber = 1,
}: AllProjectPayloadType): Promise<AllProjectResponseType> => {
  const response = await API.get(
    `/project/workspace/${workspaceId}/all?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response.data;
};

export const getProjectByIdQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<ProjectResponseType> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}`
  );
  return response.data;
};

export const getProjectAnalyticsQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<AnalyticsResponseType> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}/analytics`
  );
  return response.data;
};

export const deleteProjectMutationFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<{
  message: string;
}> => {
  const response = await API.delete(
    `/project/${projectId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};

//*******TASKS ********************************
//************************* */

export const createTaskMutationFn = async ({
  workspaceId,
  projectId,
  data,
}: CreateTaskPayloadType) => {
  const response = await API.post(
    `/task/project/${projectId}/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

export const getAllTasksQueryFn = async ({
  workspaceId,
  keyword,
  projectId,
  assignedTo,
  amount,
  priority,
  status,
  dueDate,
  pageNumber,
  pageSize,
}: AllTaskPayloadType): Promise<AllTaskResponseType> => {
  const baseUrl = `/task/workspace/${workspaceId}/all`;

  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append("keyword", keyword);
  if (projectId) queryParams.append("projectId", projectId);
  if (assignedTo) queryParams.append("assignedTo", assignedTo);
  if (priority) queryParams.append("priority", priority);
  if (amount) queryParams.append("amount", amount?.toString());
  if (status) queryParams.append("status", status);
  if (dueDate) queryParams.append("dueDate", dueDate);
  if (pageNumber) queryParams.append("pageNumber", pageNumber?.toString());
  if (pageSize) queryParams.append("pageSize", pageSize?.toString());

  const url = queryParams.toString() ? `${baseUrl}?${queryParams}` : baseUrl;
  const response = await API.get(url);
  return response.data;
};

export const deleteTaskMutationFn = async ({
  workspaceId,
  taskId,
}: {
  workspaceId: string;
  taskId: string;
}): Promise<{
  message: string;
}> => {
  const response = await API.delete(
    `task/${taskId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};
export const updateTaskMutationFn = async ({
  taskId,
  workspaceId,
  projectId,
  data,
}: UpdateTaskPayloadType) => {
  const response = await API.put(
    `/task/${taskId}/project/${projectId}/workspace/${workspaceId}/update`,
    data
  );
  return response.data;
};

//************FARMERS */
// Create Farmer
export const createFarmerMutationFn = async ({
  workspaceId,
  data,
}: {
  workspaceId: string;
  data: {
    fullName: string;
    phoneNumber: string;
    email: string;
    landArea: number;
    memberType: string;
    avgYieldSoldToMarket: string;
    nationalId: string;
    cooperativeId: string;
    joinedDate: string;
  };
}) => {
  const response = await API.post(
    `/farmer/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

// Get All Farmers
export const getAllFarmersQueryFn = async ({
  workspaceId,
  keyword,
  memberType,
  pageNumber,
  pageSize,
}: {
  workspaceId: string;
  keyword?: string;
  memberType?: string;
  pageNumber?: number;
  pageSize?: number;
}) => {
  const baseUrl = `/farmer/workspace/${workspaceId}/all`;

  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append("keyword", keyword);
  if (memberType) queryParams.append("memberType", memberType);
  if (pageNumber) queryParams.append("pageNumber", pageNumber.toString());
  if (pageSize) queryParams.append("pageSize", pageSize.toString());

  const url = queryParams.toString() ? `${baseUrl}?${queryParams}` : baseUrl;
  const response = await API.get(url);
  return response.data;
};

// Delete Farmer
export const deleteFarmerMutationFn = async ({
  workspaceId,
  farmerId,
}: {
  workspaceId: string;
  farmerId: string;
}) => {
  const response = await API.delete(
    `/farmer/${farmerId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};

// Update Farmer
export const updateFarmerMutationFn = async ({
  workspaceId,
  farmerId,
  data,
}: {
  workspaceId: string;
  farmerId: string;
  data: {
    fullName?: string;
    phoneNumber?: string;
    email?: string;
    landArea?: number;
    memberType?: string;
    avgYieldSoldToMarket?: number;
    nationalId?: string;
    cooperativeId?: string;
    joinedDate?: string;
  };
}) => {
  const response = await API.put(
    `/farmer/${farmerId}/workspace/${workspaceId}/update`,
    data
  );
  return response.data;
};

// Get Farmer by ID
export const getFarmerByIdQueryFn = async ({
  workspaceId,
  farmerId,
}: {
  workspaceId: string;
  farmerId: string;
}) => {
  const response = await API.get(
    `/farmer/${farmerId}/workspace/${workspaceId}`
  );
  return response.data;
};

