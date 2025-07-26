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
import { MapPin, Plus } from "lucide-react";

const BucketList = () => {
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

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50">
        <Navbar
          onAuthClick={() => setShowAuthModal(true)}
          onAddDestination={() => {}}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Sign In Required
            </h2>
            <p className="text-slate-600 mb-6">
              Please sign in to view your travel bucket list
            </p>
            <Button
              onClick={() => setShowAuthModal(true)}
              className="gradient-travel text-white"
            >
              Sign In
            </Button>
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
            My Travel Bucket List
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

export default BucketList;
