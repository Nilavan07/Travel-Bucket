import { create } from "zustand";
import { useAuthStore } from "@/store/authStore";

export interface Destination {
  _id: string;
  title: string;
  country: string;
  description: string;
  notes: string;
  status: "to-visit" | "visited";
  imageUrl: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  tags: string[];
  featured?: boolean;
  rating?: number;
  userId: string;
  isAdminCreated?: boolean;
  parentDestinationId?: string;
}

const isValidId = (id: string): boolean => /^[0-9a-fA-F]{24}$/.test(id);

interface DestinationState {
  destinations: Destination[];
  searchQuery: string;
  statusFilter: "all" | "to-visit" | "visited";
  countryFilter: string;
  sortBy: "newest" | "oldest" | "alphabetical";
  isLoading: boolean;

  // Actions
  fetchDestinations: () => Promise<void>;
  addDestination: (
    destination: Omit<Destination, "_id" | "createdAt">
  ) => Promise<void>;
  updateDestination: (
    id: string,
    updates: Partial<Destination>
  ) => Promise<void>;
  deleteDestination: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: "all" | "to-visit" | "visited") => void;
  setCountryFilter: (country: string) => void;
  setSortBy: (sort: "newest" | "oldest" | "alphabetical") => void;

  getFilteredDestinations: (userId?: string) => Destination[];
  createUserCopyOfAdminDestination: (
    adminDestId: string,
    userId: string
  ) => Promise<Destination | null>;
  getDestinationsForUser: (userId: string) => Destination[];
  // Admin actions
  toggleFeatured: (id: string) => Promise<void>;
  deleteDestinationByAdmin: (id: string) => void;

  // Progress tracking
  getUserStats: (userId: string) => Promise<{
    total: number;
    visited: number;
    toVisit: number;
    countries: number;
    progress: number;
  }>;
}

export const useDestinationStore = create<DestinationState>((set, get) => ({
  destinations: [],
  searchQuery: "",
  statusFilter: "all",
  countryFilter: "",
  sortBy: "newest",
  isLoading: false,

  fetchDestinations: async () => {
    set({ isLoading: true });

    try {
      const { searchQuery, statusFilter, countryFilter, sortBy } = get();

      const { getAllUsers } = useAuthStore.getState();
      await getAllUsers(); // Optional — remove if unused elsewhere

      const { user } = useAuthStore.getState();
      console.log("Current user:", user);

      if (!user) {
        console.warn("No logged-in user found.");
        set({ destinations: [] });
        return;
      }

      // 🧠 Only include userId if the user is not an admin
      const includeUserId = user.role !== "admin";

      const params = new URLSearchParams({
        ...(includeUserId ? { userId: user._id } : {}),
        ...(searchQuery ? { search: searchQuery } : {}),
        ...(statusFilter !== "all" ? { status: statusFilter } : {}),
        ...(countryFilter ? { country: countryFilter } : {}),
        sort: sortBy,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/destinations?${params}`
      );

      if (!response.ok) throw new Error("Failed to fetch destinations");

      const result = await response.json();
      set({ destinations: result.data });
    } catch (error) {
      console.error("Error fetching destinations:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addDestination: async (destination) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/destinations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...destination,
            createdAt: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      set((state) => ({
        destinations: [result.data, ...state.destinations],
      }));
    } catch (error) {
      console.error("Error adding destination:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateDestination: async (id, updates) => {
    if (!isValidId(id)) {
      console.error("Invalid destination ID");
      return;
    }

    set({ isLoading: true });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/destinations/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) throw new Error("Update failed");

      const result = await response.json();
      set((state) => ({
        destinations: state.destinations.map((dest) =>
          dest._id === id ? result.data : dest
        ),
      }));
    } catch (error) {
      console.error("Error updating destination:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteDestination: async (id) => {
    set({ isLoading: true });
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/destinations/${id}`,
        {
          method: "DELETE",
        }
      );
      set((state) => ({
        destinations: state.destinations.filter((dest) => dest._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting destination:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleFeatured: async (id) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/destinations/${id}/featured`,
        { method: "PATCH" }
      );
      if (!response.ok) throw new Error("Failed to toggle featured status");

      const result = await response.json();
      set((state) => ({
        destinations: state.destinations.map((dest) =>
          dest._id === id ? result.data : dest
        ),
      }));
    } catch (error) {
      console.error("Error toggling featured status:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteDestinationByAdmin: (id) => {
    set((state) => ({
      destinations: state.destinations.filter((dest) => dest._id !== id),
    }));
  },

  getUserStats: async (userId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/destinations/user/${userId}/stats`
      );
      if (!response.ok) throw new Error("Failed to fetch user stats");

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return {
        total: 0,
        visited: 0,
        toVisit: 0,
        countries: 0,
        progress: 0,
      };
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setCountryFilter: (country) => set({ countryFilter: country }),
  setSortBy: (sort) => set({ sortBy: sort }),

  getFilteredDestinations: (userId?: string) => {
    const { destinations, searchQuery, statusFilter, countryFilter, sortBy } =
      get();

    // Filter based on userId
    let filtered = userId
      ? destinations.filter(
          (dest) => dest.userId === userId || dest.isAdminCreated
        )
      : [...destinations];

    // Search query filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (dest) =>
          dest.title.toLowerCase().includes(query) ||
          dest.country.toLowerCase().includes(query) ||
          dest.description.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((dest) => dest.status === statusFilter);
    }

    // Country filter
    if (countryFilter) {
      filtered = filtered.filter((dest) => dest.country === countryFilter);
    }

    // Sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  },

  createUserCopyOfAdminDestination: async (adminDestId, userId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/destinations/${adminDestId}/copy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) throw new Error("Failed to create user copy");

      const result = await response.json();
      const userCopy = result.data;

      set((state) => ({
        destinations: [userCopy, ...state.destinations],
      }));

      return userCopy;
    } catch (error) {
      console.error("Error creating user copy:", error);
      return null;
    }
  },

  getDestinationsForUser: (userId) => {
    const { destinations } = get();

    // Get user's own destinations
    const userDestinations = destinations.filter(
      (dest) => dest.userId === userId && !dest.parentDestinationId
    );

    // Get admin destinations that user hasn't customized
    const adminDestinations = destinations.filter(
      (dest) => dest.isAdminCreated
    );

    const userCopies = destinations.filter(
      (dest) => dest.parentDestinationId && dest.userId === userId
    );

    const visibleAdminDestinations = adminDestinations.filter(
      (adminDest) =>
        !userCopies.some((copy) => copy.parentDestinationId === adminDest._id)
    );

    return [...userCopies, ...visibleAdminDestinations, ...userDestinations];
  },
}));
