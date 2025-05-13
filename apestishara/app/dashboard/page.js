"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Loading from "@/lib/Loading";
import { StatCard, TrendCard } from "@/lib/Card";

const fetchDashboardData = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/summary`
  );
  return data;
};

const AdminDashboard = () => {
  const [filter, setFilter] = useState("week");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 60000, // Refresh every 60 seconds
  });

  if (isLoading) return <Loading />;
  if (error)
    return <p className="text-red-500">Failed to load dashboard data</p>;

  const chartData = [
    {
      name: "Consultations",
      Today: data.consultations.today,
      Week: data.consultations.week,
    },
    {
      name: "Patients",
      Today: data.patients.today,
      Week: data.patients.week,
    },
    {
      name: "Doctors",
      Today: data.doctors.today,
      Week: data.doctors.week,
    },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

  const pieData =
    data.specialityDistribution?.map((s) => ({
      name: s.title,
      value: s.count,
    })) || [];

  const handleDownload = () => {
    window.print();
  };

  return (
    <section className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div className="flex gap-2 items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-4 py-2 rounded-md text-sm focus:outline-none focus:ring bg-[#1E2A47] text-white"
          >
            <option value="today">Today</option>
            <option value="week">Last Week</option>
          </select>
          <Button
            variant="outline"
            onClick={handleDownload}
            className="gap-1 bg-[#1E2A47] text-white"
          >
            <Download size={16} /> Print/Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Platform Cut"
          value={`$${data.platformStats.totalPlatformCut}`}
          className="border-0 border-l-4 border-teal-500  hover:shadow-md hover:shadow-teal-500"
        />
        <StatCard
          title="Total Consultations"
          value={data.consultations.total}
          className="border-0 border-l-4 border-green-500  hover:shadow-md hover:shadow-green-500"
        />
        <StatCard
          title="Total Patients"
          value={data.patients.total}
          className="border-0 border-l-4 border-blue-500  hover:shadow-md hover:shadow-blue-500"
        />
        <StatCard
          title="Total Doctors"
          value={data.doctors.total}
          className="border-0 border-l-4 border-purple-500  hover:shadow-md hover:shadow-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Transactions"
          value={data.platformStats.totalTransactions}
          className="border-0 border-l-4 border-teal-500  hover:shadow-md hover:shadow-teal-500"
        />
        <TrendCard
          title="Consultations"
          current={data.consultations.today}
          previous={data.consultations.lastWeek}
          className="border-0 border-l-4 border-green-500  hover:shadow-md hover:shadow-green-500"
        />
        <TrendCard
          title="Patients"
          current={data.patients.today}
          previous={data.patients.lastWeek}
          className="border-0 border-l-4 border-blue-500  hover:shadow-md hover:shadow-blue-500"
        />
        <TrendCard
          title="Doctors"
          current={data.doctors.today}
          previous={data.doctors.lastWeek}
          className="border-0 border-l-4 border-purple-500  hover:shadow-md hover:shadow-purple-500"
        />
      </div>

      <Card className="border-none bg-white">
        <CardHeader>
          <CardTitle className="text-black">Activity Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#000000" />
              <YAxis allowDecimals={false} stroke="#000000" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#2C3A58",
                  color: "#000000",
                }}
              />
              <Bar
                dataKey={filter === "week" ? "Week" : "Today"}
                fill={filter === "week" ? "#28A745" : "#4A6FA5"}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-none bg-white">
        <CardHeader>
          <CardTitle className="text-black">Speciality Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}`, name]}
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#2C3A58",
                  color: "#000000",
                }}
              />
              <Legend wrapperStyle={{ color: "#000000" }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminDashboard;
