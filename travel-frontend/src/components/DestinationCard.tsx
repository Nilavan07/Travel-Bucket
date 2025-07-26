"use client";
import React, { useState } from "react";
import { Destination, useDestinationStore } from "@/store/destinationStore";
import { useAuthStore } from "@/store/authStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import GoogleMap from "@/components/GoogleMap";
import { MapPin, Edit, Trash, Eye, Star } from "lucide-react";

interface DestinationCardProps {
  destination: Destination;
  onEdit: (destination: Destination) => void;
  onDelete: (id: string) => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onEdit,
  onDelete,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { createUserCopyOfAdminDestination } = useDestinationStore();
  const { user } = useAuthStore();

  const handleEdit = async () => {
    if (destination.isAdminCreated && user?._id) {
      try {
        const userCopy = await createUserCopyOfAdminDestination(
          destination._id,
          user._id
        );

        if (userCopy) {
          onEdit(userCopy);
        }
      } catch (error) {
        console.error("Failed to create user copy of destination:", error);
      }
    } else {
      onEdit(destination);
    }
  };

  const statusColors = {
    "to-visit": "bg-orange-100 text-orange-800 border-orange-200",
    visited: "bg-green-100 text-green-800 border-green-200",
  };

  const statusLabels = {
    "to-visit": "To Visit",
    visited: "Visited",
  };

  return (
    <>
      <Card className="card-hover overflow-hidden group bg-white">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={destination.imageUrl}
            alt={destination.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-3 left-3 flex space-x-2">
            <Badge
              variant="secondary"
              className={`${statusColors[destination.status]} font-medium`}
            >
              {statusLabels[destination.status]}
            </Badge>
            {destination.featured && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {destination.isAdminCreated && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Admin
              </Badge>
            )}
            {destination.parentDestinationId && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                My Version
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex space-x-2">
              <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </Dialog>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                onClick={() => onDelete(destination._id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-lg font-semibold text-white mb-1">
              {destination.title}
            </h3>
            <div className="flex items-center text-white/90 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {destination.country}
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
            {destination.description}
          </p>

          {destination.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {destination.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs px-2 py-0 h-5 bg-slate-50 text-slate-600 border-slate-200"
                >
                  {tag}
                </Badge>
              ))}
              {destination.tags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0 h-5 bg-slate-50 text-slate-600 border-slate-200"
                >
                  +{destination.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {destination.notes && (
            <p className="text-xs text-slate-500 italic line-clamp-2">
              "{destination.notes}"
            </p>
          )}

          {destination.rating && destination.status === "visited" && (
            <div className="flex items-center mt-2">
              <span className="text-sm text-slate-600 mr-2">Rating:</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < destination.rating!
                        ? "text-blue-400 fill-current"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-4 py-3 bg-slate-50 border-t">
          <div className="flex justify-between items-center w-full text-xs text-slate-500">
            <span>
              Added {new Date(destination.createdAt).toLocaleDateString()}
            </span>
            {destination.coordinates && (
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                Pin saved
              </span>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Destination Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-sky-600" />
              <span>{destination.title}</span>
            </DialogTitle>
            <DialogDescription>
              {destination.country} • Added{" "}
              {new Date(destination.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Image */}
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={destination.imageUrl}
                alt={destination.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500";
                }}
              />
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-slate-600">{destination.description}</p>
            </div>

            {/* Notes */}
            {destination.notes && (
              <div>
                <h4 className="font-semibold mb-2">Personal Notes</h4>
                <p className="text-slate-600 italic">"{destination.notes}"</p>
              </div>
            )}

            {/* Tags */}
            {destination.tags.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {destination.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {destination.coordinates && (
              <div>
                <h4 className="font-semibold mb-2">Location</h4>
                <GoogleMap
                  coordinates={destination.coordinates}
                  title={destination.title}
                  height="400px"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DestinationCard;
