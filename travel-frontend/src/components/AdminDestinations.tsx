import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useDestinationStore } from "@/store/destinationStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Trash2, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface User {
  _id: string;
  name: string;
  role: string;
  // Add more fields if needed
}

const AdminDestinations: React.FC = () => {
  const { user, getAllUsers } = useAuthStore();
  const { destinations, toggleFeatured, deleteDestinationByAdmin } =
    useDestinationStore();

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await getAllUsers();
      setUsers(allUsers || []);
    };
    fetchUsers();
  }, [getAllUsers]);

  const getUserById = (userId: string) => users.find((u) => u._id === userId);

  const handleToggleFeatured = (id: string) => {
    toggleFeatured(id);
    const destination = destinations.find((d) => d._id === id);
    toast({
      title: destination?.featured
        ? "Removed from featured"
        : "Added to featured",
      description: `${destination?.title} has been ${
        destination?.featured ? "removed from" : "added to"
      } featured destinations.`,
    });
  };

  const handleDeleteDestination = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this destination? This action cannot be undone."
      )
    ) {
      deleteDestinationByAdmin(id);
      toast({
        title: "Destination deleted",
        description: "The destination has been removed successfully.",
      });
    }
  };

  if (user?.role !== "admin") {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">Admin access required</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span>All Destinations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {destinations.map((destination) => {
            const destinationUser = getUserById(destination.userId);
            return (
              <div
                key={destination._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={destination.imageUrl}
                    alt={destination.title}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500";
                    }}
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{destination.title}</h4>
                      {destination.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge
                        variant={
                          destination.status === "visited"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {destination.status === "visited"
                          ? "Visited"
                          : "To Visit"}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">
                      {destination.country}
                    </p>
                    <p className="text-xs text-slate-500">
                      By {destinationUser?.name || "Unknown"} •{" "}
                      {new Date(destination.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleFeatured(destination._id)}
                    className="text-yellow-600 hover:text-yellow-700"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    {destination.featured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteDestination(destination._id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDestinations;
