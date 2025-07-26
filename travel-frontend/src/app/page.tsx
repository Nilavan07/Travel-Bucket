"use client";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useDestinationStore } from "@/store/destinationStore";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import FilterBar from "@/components/FilterBar";
import DestinationCard from "@/components/DestinationCard";
import AddDestinationModal from "@/components/AddDestinationModal";
import { Button } from "@/components/ui/button";
import { Destination } from "@/store/destinationStore";
import { MapPin, Plus, Compass } from "lucide-react";

const Index = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { getFilteredDestinations, deleteDestination, fetchDestinations } =
    useDestinationStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDestination, setEditingDestination] =
    useState<Destination | null>(null);

  useEffect(() => {
    if (user?._id) {
      fetchDestinations(); // don't pass userId – fetchDestinations already uses user from the store
    }
  }, [user?._id, fetchDestinations]);

  const filteredDestinations = getFilteredDestinations(
    user?.role !== "admin" ? user?._id : undefined
  );

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination);
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setEditingDestination(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this destination?")) {
      deleteDestination(id);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50">
        <Navbar
          onAuthClick={() => setShowAuthModal(true)}
          onAddDestination={() => {}}
        />

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 gradient-travel rounded-2xl flex items-center justify-center shadow-lg">
                <Compass className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-sky-600 via-purple-600 to-blue-500 bg-clip-text text-transparent">
                Your Travel Dreams
              </span>
              <br />
              <span className="text-slate-800">Start Here</span>
            </h1>

            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Create your personalized travel bucket list, discover amazing
              destinations, and turn your travel dreams into reality. Track
              where you've been and plan where you're going next.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setShowAuthModal(true)}
                size="lg"
                className="gradient-travel text-white hover:opacity-90 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg rounded-xl border-2 hover:bg-slate-50"
                onClick={() => setShowAuthModal(true)}
              >
                <MapPin className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 gradient-travel rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Track Destinations
              </h3>
              <p className="text-slate-600">
                Add places you want to visit and mark the ones you've conquered.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Easy Management
              </h3>
              <p className="text-slate-600">
                Simple interface to add, edit, and organize your travel goals.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Discover & Plan
              </h3>
              <p className="text-slate-600">
                Search, filter, and plan your next adventure with ease.
              </p>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50">
      <Navbar
        onAuthClick={() => setShowAuthModal(true)}
        onAddDestination={() => setShowAddModal(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            My Travel Dashboard
          </h1>
          <p className="text-slate-600">
            {filteredDestinations.length} destination
            {filteredDestinations.length !== 1 ? "s" : ""} in your collection
          </p>
        </div>

        {/* Filters */}
        <FilterBar />

        {/* Destinations Grid */}
        {filteredDestinations.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              No destinations found
            </h3>
            <p className="text-slate-600 mb-6">
              Start building your travel bucket list by adding your first
              destination.
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="gradient-travel text-white hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Destination
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDestinations.map((destination) => (
              <DestinationCard
                key={destination._id}
                destination={destination}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <AddDestinationModal
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
        editingDestination={editingDestination}
      />
    </div>
  );
};

export default Index;
