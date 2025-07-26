"use client";
import React, { useState, useEffect } from "react";
import { useDestinationStore, Destination } from "@/store/destinationStore";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { MapPin, Plus, X } from "lucide-react";

interface AddDestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingDestination?: Destination | null;
}

const AddDestinationModal: React.FC<AddDestinationModalProps> = ({
  isOpen,
  onClose,
  editingDestination,
}) => {
  const { addDestination, updateDestination } = useDestinationStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: "",
    country: "",
    description: "",
    notes: "",
    status: "to-visit" as "to-visit" | "visited",
    imageUrl: "",
    tags: [] as string[],
    userId: user?._id || "1",
    coordinates: { lat: 0, lng: 0 },
    rating: undefined as number | undefined,
  });
  const [newTag, setNewTag] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (editingDestination) {
      setFormData({
        title: editingDestination.title,
        country: editingDestination.country,
        description: editingDestination.description,
        notes: editingDestination.notes,
        status: editingDestination.status,
        imageUrl: editingDestination.imageUrl,
        tags: editingDestination.tags,
        userId: editingDestination.userId,
        coordinates: editingDestination.coordinates || { lat: 0, lng: 0 },
        rating: editingDestination.rating,
      });
    } else {
      // Reset form for new destination
      setFormData({
        title: "",
        country: "",
        description: "",
        notes: "",
        status: "to-visit",
        imageUrl: "",
        tags: [],
        userId: user?._id || "1",
        coordinates: { lat: 0, lng: 0 },
        rating: undefined,
      });
    }
    setNewTag("");
  }, [editingDestination, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.country.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in the destination title and country.",
        variant: "destructive",
      });
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        coordinates:
          formData.coordinates.lat === 0 && formData.coordinates.lng === 0
            ? undefined
            : formData.coordinates,
        rating: formData.rating === 0 ? undefined : formData.rating,
      };

      if (editingDestination) {
        updateDestination(editingDestination._id, dataToSave);
        toast({
          title: "Destination updated!",
          description: `${formData.title} has been updated successfully.`,
        });
      } else {
        addDestination(dataToSave);
        toast({
          title: "Destination added!",
          description: `${formData.title} has been added to your bucket list.`,
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      newTag.trim() &&
      !formData.tags.includes(newTag.trim())
    ) {
      e.preventDefault();
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagIndex: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, index) => index !== tagIndex),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-sky-600" />
            <span>
              {editingDestination ? "Edit Destination" : "Add New Destination"}
            </span>
          </DialogTitle>
          <DialogDescription>
            {editingDestination
              ? "Update your destination details below."
              : "Add a new place to your travel bucket list."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Destination Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Santorini, Greece"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              placeholder="e.g., Greece"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What makes this place special?"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
            />
            {formData.imageUrl && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="e.g., 36.3932"
                value={formData.coordinates.lat || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coordinates: {
                      ...formData.coordinates,
                      lat: parseFloat(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="e.g., 25.4615"
                value={formData.coordinates.lng || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coordinates: {
                      ...formData.coordinates,
                      lng: parseFloat(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
          </div>

          {/* Rating (only for visited destinations) */}
          {formData.status === "visited" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Rating
              </Label>
              <Select
                value={formData.rating?.toString() || "0"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    rating: value === "0" ? undefined : parseInt(value),
                  })
                }
              >
                <SelectTrigger className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm">
                  <SelectValue placeholder="Rate your experience" />
                </SelectTrigger>

                <SelectContent className="bg-white rounded-md shadow-md border border-gray-200">
                  <SelectItem value="0">No rating</SelectItem>
                  <SelectItem value="1">⭐ 1 star</SelectItem>
                  <SelectItem value="2">⭐⭐ 2 stars</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ 3 stars</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ 4 stars</SelectItem>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ 5 stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "to-visit" | "visited") =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger className="w-full bg-gray-100 border border-gray-300 px-3 py-2 rounded-md text-sm shadow-sm">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent className="bg-white border border-gray-200 rounded-md shadow-md">
                <SelectItem value="to-visit">To Visit</SelectItem>
                <SelectItem value="visited">Visited</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Add a tag and press Enter"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={addTag}
            />
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-sky-100 text-sky-800 border-sky-200 pr-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 hover:bg-sky-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Personal Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any special notes or reminders?"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={2}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-4">
            <div className="flex justify-end space-x-2 pt-4">
              {/* Cancel Button */}
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Button>

              {/* Submit Button with conditional gradient */}
              <Button
                type="submit"
                className={`text-white font-semibold px-4 py-2 rounded-md shadow-md transition
      ${
        editingDestination
          ? "bg-gradient-to-r from-pink-500 to-yellow-500 hover:opacity-90"
          : "bg-gradient-to-r from-sky-500 to-teal-400 hover:opacity-90"
      }`}
              >
                {editingDestination ? "Update Destination" : "Add Destination"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDestinationModal;
