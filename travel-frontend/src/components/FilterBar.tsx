import React from "react";
import { useDestinationStore } from "@/store/destinationStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

const FilterBar: React.FC = () => {
  const {
    searchQuery,
    statusFilter,
    countryFilter,
    sortBy,
    setSearchQuery,
    setStatusFilter,
    setCountryFilter,
    setSortBy,
    destinations,
  } = useDestinationStore();

  // Get unique countries from destinations
  const countries = Array.from(
    new Set(destinations.map((dest) => dest.country))
  ).sort();

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCountryFilter("");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    countryFilter ||
    sortBy !== "newest";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search destinations, countries, or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
              Status:
            </span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] bg-white border border-slate-300 hover:bg-slate-50 focus:ring-2 focus:ring-sky-500">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-200 shadow-md rounded-md">
                <SelectItem
                  value="all"
                  className="hover:bg-slate-100 focus:bg-slate-100 cursor-pointer"
                >
                  All
                </SelectItem>
                <SelectItem
                  value="to-visit"
                  className="hover:bg-slate-100 focus:bg-slate-100 cursor-pointer"
                >
                  To Visit
                </SelectItem>
                <SelectItem
                  value="visited"
                  className="hover:bg-slate-100 focus:bg-slate-100 cursor-pointer"
                >
                  Visited
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Country Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
              Country:
            </span>
            <Select
              value={countryFilter || "all-countries"}
              onValueChange={(value) =>
                setCountryFilter(value === "all-countries" ? "" : value)
              }
            >
              <SelectTrigger className="w-[140px] bg-white border border-slate-300 text-sm rounded-md px-3 py-2 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition">
                <SelectValue placeholder="All countries" />
              </SelectTrigger>

              <SelectContent className="bg-white border border-slate-200 shadow-md rounded-md text-sm">
                <SelectItem
                  value="all-countries"
                  className="cursor-pointer hover:bg-slate-100 focus:bg-slate-100"
                >
                  All countries
                </SelectItem>

                {countries.map((country) => (
                  <SelectItem
                    key={country}
                    value={country}
                    className="cursor-pointer hover:bg-slate-100 focus:bg-slate-100"
                  >
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
              Sort by:
            </span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px] bg-white border border-slate-300 text-sm rounded-md px-3 py-2 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>

              <SelectContent className="bg-white border border-slate-200 shadow-md rounded-md text-sm">
                <SelectItem
                  value="newest"
                  className="cursor-pointer hover:bg-slate-100 focus:bg-slate-100"
                >
                  Newest
                </SelectItem>
                <SelectItem
                  value="oldest"
                  className="cursor-pointer hover:bg-slate-100 focus:bg-slate-100"
                >
                  Oldest
                </SelectItem>
                <SelectItem
                  value="alphabetical"
                  className="cursor-pointer hover:bg-slate-100 focus:bg-slate-100"
                >
                  A-Z
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-slate-600 hover:text-slate-800"
            >
              <X className="w-4 h-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge
                variant="secondary"
                className="bg-sky-100 text-sky-800 border-sky-200"
              >
                Searching: "{searchQuery}"
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800 border-orange-200"
              >
                Status: {statusFilter === "to-visit" ? "To Visit" : "Visited"}
              </Badge>
            )}
            {countryFilter && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 border-green-200"
              >
                Country: {countryFilter}
              </Badge>
            )}
            {sortBy !== "newest" && (
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800 border-purple-200"
              >
                Sort: {sortBy === "oldest" ? "Oldest" : "A-Z"}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
