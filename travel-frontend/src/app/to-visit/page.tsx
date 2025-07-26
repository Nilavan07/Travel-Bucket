"use client";
import React, { useState } from "react";
import { useDestinationStore } from "@/store/destinationStore";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import DestinationCard from "@/components/DestinationCard";
import AddDestinationModal from "@/components/AddDestinationModal";
import { Button } from "@/components/ui/button";
import { Destination } from "@/store/destinationStore";
import { MapPin, Plus, Compass } from "lucide-react";

const ToVisit = () => {
  const { getFilteredDestinations, deleteDestination } = useDestinationStore();
  const { user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDestination, setEditingDestination] =
    useState<Destination | null>(null);

  const allUserDestinations = getFilteredDestinations(user?._id);
  const toVisitDestinations = allUserDestinations.filter(
    (dest) => dest.status === "to-visit"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50">
      <Navbar
        onAuthClick={() => setShowAuthModal(true)}
        onAddDestination={() => setShowAddModal(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
              <Compass className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                To Visit Destinations
              </h1>
              <p className="text-slate-600">
                {toVisitDestinations.length} place
                {toVisitDestinations.length !== 1 ? "s" : ""} on your wishlist
              </p>
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        {toVisitDestinations.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Compass className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              No destinations on your wishlist
            </h3>
            <p className="text-slate-600 mb-6">
              Add destinations you want to visit to see them here.
            </p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="gradient-travel text-white hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Destination
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {toVisitDestinations.map((destination) => (
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

export default ToVisit;
