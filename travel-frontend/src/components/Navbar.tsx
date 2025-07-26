"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MapPin, Plus, Home, List, Filter, User, Settings } from "lucide-react";

interface NavbarProps {
  onAuthClick: () => void;
  onAddDestination: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAuthClick, onAddDestination }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navigationItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/bucket-list", label: "My Bucket List", icon: List },
    { path: "/visited", label: "Visited", icon: MapPin },
    { path: "/to-visit", label: "To Visit", icon: Filter },
  ];

  if (user?.role === "admin") {
    navigationItems.push({
      path: "/admin",
      label: "Admin Panel",
      icon: Settings,
    });
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Travel Bucket
            </span>
          </Link>

          {/* Navigation Menu - Desktop */}
          {isAuthenticated && (
            <div className="hidden md:flex">
              <NavigationMenu>
                <NavigationMenuList>
                  {navigationItems.map((item) => (
                    <NavigationMenuItem key={item.path}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.path}
                          className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                            isActive(item.path)
                              ? "bg-gray-100 text-gray-900 font-semibold"
                              : "text-gray-600"
                          }`}
                        >
                          <item.icon className="w-4 h-4 mr-2" />
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role !== "admin" && (
                  <Button
                    onClick={onAddDestination}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Add Destination</span>
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-56 bg-white border border-slate-200 shadow-xl rounded-md"
                    align="end"
                    forceMount
                  >
                    {/* User Info */}
                    <div className="flex flex-col space-y-1 p-3 bg-slate-50 rounded-t-md">
                      <p className="text-sm font-medium leading-none text-slate-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Profile Link */}
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <Link
                        href="/profile"
                        className="flex items-center w-full"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>

                    {/* Admin Panel (if admin) */}
                    {user?.role === "admin" && (
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <Link
                          href="/admin"
                          className="flex items-center w-full"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    {/* Logout */}
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isAuthenticated && (
          <div className="md:hidden pb-4">
            <div className="flex flex-wrap gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
