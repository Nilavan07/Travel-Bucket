import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: string;
}

interface AuthState {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: string
  ) => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;

  getAllUsers: () => Promise<User[]>;

  deleteUser: (userId: string) => Promise<void>;
}

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${API}/api/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
            throw new Error("Login failed");
          }

          const user: User = await res.json();
          set({ user, isAuthenticated: true });
        } catch (error) {
          console.error("Login error:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (name, email, password, role = "user") => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${API}/api/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role }),
          });

          if (!res.ok) {
            throw new Error("Registration failed");
          }

          const user: User = await res.json();
          set({ user, isAuthenticated: true });
        } catch (error) {
          console.error("Registration error:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      deleteAccount: async () => {
        const user = get().user;
        if (!user) return;

        try {
          await fetch(`${API}/api/users/${user._id}`, {
            method: "DELETE",
          });
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error("Delete account failed:", error);
        }
      },

      updateProfile: (data) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser = { ...currentUser, ...data };
        set((state) => ({
          user: updatedUser,
          users: state.users.map((u) =>
            u._id === currentUser._id ? updatedUser : u
          ),
        }));
      },
      getAllUsers: async () => {
        try {
          const res = await fetch(`${API}/api/users`);
          if (!res.ok) throw new Error("Failed to fetch users");

          const users: User[] = await res.json();
          set({ users });

          return users;
        } catch (error) {
          console.error("Get all users error:", error);
          return [];
        }
      },

      deleteUser: async (userId) => {
        try {
          await fetch(`${API}/api/users/${userId}`, {
            method: "DELETE",
          });
          set((state) => ({
            users: state.users.filter((u) => u._id !== userId),
          }));
        } catch (error) {
          console.error("Delete user error:", error);
        }
      },
    }),
    {
      name: "travel-auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
