"use client";
import React, { useEffect, useState } from "react";
import { useDestinationStore } from "@/store/destinationStore";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MapPin, CheckCircle, Compass, Globe } from "lucide-react";

const ProgressStats: React.FC = () => {
  const { user } = useAuthStore();
  const { getUserStats } = useDestinationStore();

  const [stats, setStats] = useState<{
    total: number;
    visited: number;
    toVisit: number;
    countries: number;
    progress: number;
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (user?._id) {
        const data = await getUserStats(user._id);
        setStats(data);
      }
    };
    fetchStats();
  }, [user, getUserStats]);

  if (!user || !stats) return null;

  const statCards = [
    {
      title: "Total Destinations",
      value: stats.total,
      icon: MapPin,
      color: "text-sky-600",
      bg: "bg-sky-100",
    },
    {
      title: "Visited",
      value: stats.visited,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "To Visit",
      value: stats.toVisit,
      icon: Compass,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Countries",
      value: stats.countries,
      icon: Globe,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Travel Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Visited destinations</span>
            <span className="font-semibold text-slate-800">
              {stats.visited} of {stats.total}
            </span>
          </div>
          <Progress value={stats.progress} className="h-3" />
          <p className="text-center text-lg font-semibold text-green-600">
            {stats.progress}% Complete
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card
            key={stat.title}
            className={`shadow-sm border-slate-200 hover:shadow-md transition`}
          >
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full ${stat.bg} mb-3`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProgressStats;
