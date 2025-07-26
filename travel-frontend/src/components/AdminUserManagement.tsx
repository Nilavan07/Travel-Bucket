"use client";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useDestinationStore } from "@/store/destinationStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Users, Trash2, Crown, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminUserManagement: React.FC = () => {
  const { user, users, getAllUsers, deleteUser } = useAuthStore();
  const { getUserStats } = useDestinationStore();
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [userStatsMap, setUserStatsMap] = useState<
    Record<string, Awaited<ReturnType<typeof getUserStats>>>
  >({});

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const stats: Record<
        string,
        Awaited<ReturnType<typeof getUserStats>>
      > = {};
      for (const u of users) {
        stats[u._id] = await getUserStats(u._id);
      }
      setUserStatsMap(stats);
    };

    if (users.length > 0) {
      fetchStats();
    }
  }, [users]);

  const handleDeleteUser = (userId: string) => {
    if (user?.role === "admin" && userId !== user._id) {
      deleteUser(userId);
      toast({
        title: "User deleted",
        description: "The user account has been removed successfully.",
      });
      setDeletingUserId(null);
    }
  };

  if (user?.role !== "admin") {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Crown className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">Admin access required</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>User Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((u) => {
              const stats = userStatsMap[u._id];
              return (
                <div
                  key={u._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={u.avatar} alt={u.name} />
                      <AvatarFallback>
                        {u.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{u.name}</h4>
                        <Badge
                          variant={u.role === "admin" ? "default" : "secondary"}
                        >
                          {u.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{u.email}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-slate-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {stats?.total ?? 0} destinations
                        </span>
                        <span className="text-xs text-slate-500">
                          Joined {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {u._id !== user._id && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setDeletingUserId(u._id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete User Account
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {u.name}'s account?
                            This action cannot be undone and will remove all
                            their destinations.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(u._id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete User
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagement;
