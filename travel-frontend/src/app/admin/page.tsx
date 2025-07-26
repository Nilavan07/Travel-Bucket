"use client";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useDestinationStore } from "@/store/destinationStore";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import AddDestinationModal from "@/components/AddDestinationModal";
import AdminUserManagement from "@/components/AdminUserManagement";
import AdminDestinations from "@/components/AdminDestinations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, MapPin, Star, TrendingUp } from "lucide-react";

const Admin = () => {
  const { getAllUsers, users } = useAuthStore();
  const { destinations } = useDestinationStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const user = useAuthStore((state) => state.user); // assuming user object has `id`
  const fetchDestinations = useDestinationStore(
    (state) => state.fetchDestinations
  );
  const destinationsList = useDestinationStore((state) => state.destinations);
  useEffect(() => {
    if (user?._id) {
      fetchDestinations(); // this must run!
    }
  }, [user?._id, fetchDestinations]);

  console.log("Fetched destinations:", destinationsList);
  // Fetch users on mount
  useEffect(() => {
    getAllUsers();
  }, []);

  const totalDestinations = destinations.length;
  const visitedCount = destinations.filter(
    (dest) => dest.status === "visited"
  ).length;
  const toVisitCount = destinations.filter(
    (dest) => dest.status === "to-visit"
  ).length;
  const featuredCount = destinations.filter((dest) => dest.featured).length;

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      color: "bg-sky-100 text-sky-600",
    },
    {
      label: "All Destinations",
      value: totalDestinations,
      icon: MapPin,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Visited",
      value: visitedCount,
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Featured",
      value: featuredCount,
      icon: Star,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  // Auth and Role Checks
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50">
        <Navbar
          onAuthClick={() => setShowAuthModal(true)}
          onAddDestination={() => setShowAddModal(true)}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Settings className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Access Denied
          </h2>
          <p className="text-slate-600 mb-6">
            You need to be logged in to access this page
          </p>
          <Button
            onClick={() => setShowAuthModal(true)}
            className="gradient-travel text-white"
          >
            Sign In
          </Button>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50">
        <Navbar
          onAuthClick={() => setShowAuthModal(true)}
          onAddDestination={() => setShowAddModal(true)}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Settings className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Admin Access Required
          </h2>
          <p className="text-slate-600">
            You need admin privileges to access this page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50">
      <Navbar
        onAuthClick={() => setShowAuthModal(true)}
        onAddDestination={() => setShowAddModal(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-tr from-sky-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-gray-600 text-sm">
                Manage users, destinations, and system settings
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
                    >
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-white data-[state=active]:text-black rounded-md"
              >
                User Management
              </TabsTrigger>
              <TabsTrigger
                value="destinations"
                className="data-[state=active]:bg-white data-[state=active]:text-black rounded-md"
              >
                Destination Management
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <AdminUserManagement />
            </TabsContent>

            <TabsContent value="destinations">
              <AdminDestinations />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      <AddDestinationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};

export default Admin;
