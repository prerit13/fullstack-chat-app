import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // ✔ CHECK AUTH
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data.user });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ✔ SIGNUP
  signup: async (data) => {
  // 🚫 prevent duplicate requests
  if (get().isSigningUp) return;

  set({ isSigningUp: true });

  try {
    const res = await axiosInstance.post("/auth/signup", data);

    set({ authUser: res.data });
    toast.success("Account created successfully");

    if (get().connectSocket) {
      get().connectSocket();
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Signup failed"
    );
  } finally {
    set({ isSigningUp: false });
  }
},


  // Add login, logout later similarly...
  login: async (data) => {
  set({ isLoggingIn: true });

  try {
    const res = await axiosInstance.post("/auth/login", data);

    // Store the logged-in user
    set({ authUser: res.data });

    toast.success("Logged in successfully");

    // Connect to socket after successful login
    get().connectSocket();
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Login failed. Please try again.";

    toast.error(errorMessage);
  } finally {
    set({ isLoggingIn: false });
  }
},


   logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

   connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
