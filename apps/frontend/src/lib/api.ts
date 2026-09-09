import axios from "axios";

const getEnvVar = (key: string): string => {
  // 1. Dynamic injection from dev server /env.js or build output
  if (typeof window !== "undefined" && (window as any)?.__ENV__?.[key]) {
    return (window as any).__ENV__[key];
  }
  // 2. Bundler import.meta.env
  try {
    if (typeof import.meta !== "undefined" && (import.meta as any)?.env?.[key]) {
      return (import.meta as any).env[key];
    }
  } catch {}
  // 3. Statically inlined process.env
  try {
    if (typeof process !== "undefined" && process?.env?.[key]) {
      return process.env[key] as string;
    }
  } catch {}
  return "";
};

const envApiUrl =
  getEnvVar("VITE_BACKEND_URL") ||
  getEnvVar("BACKEND_URL") ||
  "";

const envWsUrl =
  getEnvVar("VITE_WS_URL") ||
  getEnvVar("WS_URL") ||
  "";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const formatApiUrl = (url: string) => {
  if (isLocalhost) {
    // When developing on localhost, connect to local backend (port 3001)
    if (!url || url.includes("mino-be.onrender.com")) {
      return "http://localhost:3001/api/v1";
    }
  }
  if (!url) {
    return "https://mino-be.onrender.com/api/v1";
  }
  const trimmed = url.replace(/\/+$/, "");
  return trimmed.endsWith("/api/v1") ? trimmed : `${trimmed}/api/v1`;
};

const formatWsUrl = (url: string) => {
  if (!url) return "wss://mino-ws.onrender.com";
  let trimmed = url.replace(/\/+$/, "");
  if (trimmed.startsWith("https://")) {
    trimmed = trimmed.replace(/^https:\/\//, "wss://");
  } else if (trimmed.startsWith("http://")) {
    trimmed = trimmed.replace(/^http:\/\//, "ws://");
  }
  return trimmed;
};

export const BACKEND_BASE_URL = formatApiUrl(envApiUrl);
export const WS_BASE_URL = formatWsUrl(envWsUrl);

export const api = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't auto-redirect if checking auth or on login page
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/signup") {
        localStorage.removeItem("token");
      }
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
  profilePicture?: string | null;
  name?: string | null;
  googleId?: string | null;
}

export interface Org {
  id: string;
  name: string;
  description: string;
}

export interface Membership {
  id: string;
  userId: string;
  orgId: string;
  role: "admin" | "member";
  user?: User;
  org?: Org;
}

export interface Board {
  id: string;
  title: string;
  orgId: string;
  section?: Section[];
  issues?: Issue[];
  org?: Org;
}

export interface Section {
  id: string;
  title: string;
  boardId: string;
  issues?: Issue[];
}

export interface Comment {
  id: string;
  comment: string;
  issueId: string;
  userId?: string | null;
  user?: User;
  createdAt?: string;
}

export interface IssueMapping {
  id: string;
  userId: string;
  issueId: string;
  user?: User;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  boardId: string;
  sectionId: string;
  comments?: Comment[];
  issueMappings?: IssueMapping[];
}

export const authApi = {
  signup: async (email: string, password: string) => {
    const res = await api.post("/signup", { email, password });
    return res.data;
  },
  login: async (email: string, password: string) => {
    const res = await api.post("/login", { email, password });
    return res.data;
  },
  me: async () => {
    const res = await api.get("/me");
    return res.data;
  },
  updateProfile: async (data: { profilePicture?: string | null; name?: string | null }) => {
    const res = await api.patch("/profile", data);
    return res.data;
  },
  getGoogleAuthUrl: () => {
    const returnUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";
    return `${BACKEND_BASE_URL}/auth/google?redirect=${encodeURIComponent(returnUrl)}`;
  },
};

export const orgApi = {
  getOrganizations: async (): Promise<Membership[]> => {
    const res = await api.get("/organizations");
    return res.data.data || [];
  },
  createOrganization: async (name: string, description: string) => {
    const res = await api.post("/organization/create", { name, description });
    return res.data;
  },
  updateOrganization: async (orgId: string, name?: string, description?: string) => {
    const res = await api.patch(`/organization/${orgId}`, { name, description });
    return res.data;
  },
  deleteOrganization: async (orgId: string) => {
    const res = await api.delete(`/organization/${orgId}`);
    return res.data;
  },
  getMembers: async (orgId: string): Promise<Membership[]> => {
    const res = await api.get(`/membership/${orgId}`);
    return res.data.data?.membership || [];
  },
  removeMember: async (orgId: string, userId: string) => {
    const res = await api.delete(`/membership/${orgId}/${userId}`);
    return res.data;
  },
  inviteMember: async (orgId: string, email: string) => {
    const res = await api.post("/invite", { orgId, email });
    return res.data;
  },
  acceptInvite: async (invitationId: string, orgId: string) => {
    const res = await api.post(`/accept-invite/${invitationId}`, { orgId });
    return res.data;
  },
};

export const boardApi = {
  getBoards: async (orgId: string): Promise<Board[]> => {
    const res = await api.get("/boards", { params: { orgId } });
    return Array.isArray(res.data.data) ? res.data.data : [];
  },
  getBoard: async (boardId: string): Promise<Board> => {
    const res = await api.get(`/board/${boardId}`);
    return res.data.data;
  },
  createBoard: async (orgId: string, title: string) => {
    const res = await api.post("/board/create", { orgId, title });
    return res.data;
  },
  updateBoard: async (boardId: string, title: string) => {
    const res = await api.patch(`/board/${boardId}`, { title });
    return res.data;
  },
  deleteBoard: async (boardId: string) => {
    const res = await api.delete(`/board/${boardId}`);
    return res.data;
  },
};

export const sectionApi = {
  createSection: async (boardId: string, title: string): Promise<Section> => {
    const res = await api.post("/section", { boardId, title });
    return res.data.data;
  },
  getSections: async (boardId: string): Promise<Section[]> => {
    const res = await api.get("/sections", { params: { boardId } });
    return res.data.data || [];
  },
  updateSection: async (sectionId: string, title: string) => {
    const res = await api.patch(`/section/${sectionId}`, { title });
    return res.data;
  },
  deleteSection: async (sectionId: string) => {
    const res = await api.delete(`/section/${sectionId}`);
    return res.data;
  },
};

export const issueApi = {
  createIssue: async (sectionId: string, title: string, description: string): Promise<Issue> => {
    const res = await api.post(`/issue/${sectionId}`, { title, description });
    return res.data.data;
  },
  getIssuesByBoard: async (boardId: string): Promise<Issue[]> => {
    const res = await api.get("/issues", { params: { boardId } });
    return res.data.data || [];
  },
  getIssuesBySection: async (sectionId: string): Promise<Issue[]> => {
    const res = await api.get(`/issue/${sectionId}`);
    return res.data.data || [];
  },
  updateIssue: async (issueId: string, title: string, description: string) => {
    const res = await api.patch(`/issue/${issueId}`, { title, description });
    return res.data;
  },
  moveIssue: async (issueId: string, sectionId: string) => {
    const res = await api.put(`/issue/move/${issueId}/${sectionId}`);
    return res.data;
  },
  deleteIssue: async (issueId: string) => {
    const res = await api.delete(`/issue/${issueId}`);
    return res.data;
  },
};

export const commentApi = {
  getComments: async (issueId: string): Promise<Comment[]> => {
    const res = await api.get(`/comment/${issueId}`);
    return res.data.data || [];
  },
  createComment: async (issueId: string, comment: string): Promise<Comment> => {
    const res = await api.post(`/comment/${issueId}`, { comment });
    return {
      id: Math.random().toString(),
      comment: res.data.data,
      issueId,
      user: res.data.user,
    };
  },
  updateComment: async (commentId: string, comment: string) => {
    const res = await api.patch(`/comment/${commentId}`, { comment });
    return res.data;
  },
  deleteComment: async (commentId: string) => {
    const res = await api.delete(`/comment/${commentId}`);
    return res.data;
  },
};
