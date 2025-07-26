"use client";
import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import AddDestinationModal from "@/components/AddDestinationModal";
import ProgressStats from "@/components/ProgressStats";
import AccountDeletion from "@/components/AccountDeletion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, BarChart3, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, isAuthenticated, updateProfile } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateProfile(formData);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50">
        <Navbar
          onAuthClick={() => setShowAuthModal(true)}
          onAddDestination={() => setShowAddModal(true)}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-sky-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Sign In Required
            </h2>
            <p className="text-slate-600 mb-6">
              Please sign in to view your profile
            </p>
            <Button
              onClick={() => setShowAuthModal(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md transition"
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Avatar className="w-16 h-16 mr-4">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-sky-100 text-sky-700 text-xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
              <p className="text-slate-600">{user.email}</p>
              <p className="text-sm text-slate-500">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-md">
            <TabsTrigger
              value="stats"
              className="text-sm font-medium text-slate-700 px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition hover:bg-slate-200"
            >
              Travel Stats
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="text-sm font-medium text-slate-700 px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition hover:bg-slate-200"
            >
              Profile Settings
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="text-sm font-medium text-slate-700 px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition hover:bg-slate-200"
            >
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <ProgressStats />
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input
                      id="avatar"
                      type="url"
                      value={formData.avatar}
                      onChange={(e) =>
                        setFormData({ ...formData, avatar: e.target.value })
                      }
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md transition flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Account Type</Label>
                      <p className="text-sm font-medium capitalize">
                        {user.role}
                      </p>
                    </div>
                    <div>
                      <Label>Member Since</Label>
                      <p className="text-sm font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <AccountDeletion />
            </div>
          </TabsContent>
        </Tabs>
      </div>

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

export default Profile;
