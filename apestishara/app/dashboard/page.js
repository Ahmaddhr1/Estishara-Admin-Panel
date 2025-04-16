'use client';

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ArrowUp, ArrowDown, Download } from "lucide-react";
import Loading from "@/lib/Loading";

const fetchDashboardData = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/summary`
  );
  return data;
};

const AdminDashboard = () => {
  const [filter, setFilter] = useState("week");
  const [selectedSpeciality, setSelectedSpeciality] = useState(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 60000, // Refresh every 60 seconds
  });

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red-500">Failed to load dashboard data</p>;

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

  const pieData = data.specialityDistribution?.map((s) => ({
    name: s.title,
    value: s.count,
  })) || [];

  const renderChange = (current, previous) => {
    const change = current - previous;
    const isUp = change > 0;
    const isDown = change < 0;
    return (
      <span className={`ml-2 ${isUp ? "text-green-500" : isDown ? "text-red-500" : "text-gray-400"} font-medium animate-pulse`}>
        {isUp && <ArrowUp size={16} className="inline" />} 
        {isDown && <ArrowDown size={16} className="inline" />} 
        {Math.abs(change)}
      </span>
    );
  };

  const handleSliceClick = (data) => {
    if (data?.name) {
      setSelectedSpeciality(data.name);
      alert(`Navigate to doctor list with speciality: ${data.name}`);
    }
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <section className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div className="flex gap-2">
          <Button
            variant={filter === "week" ? "default" : "outline"}
            onClick={() => setFilter("week")}
          >
            This Week
          </Button>
          <Button
            variant={filter === "today" ? "default" : "outline"}
            onClick={() => setFilter("today")}
          >
            Today
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-blue-500 shadow-md">
          <CardHeader>
            <CardTitle>Total Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{data.consultations.total}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-green-500 shadow-md">
          <CardHeader>
            <CardTitle>Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{data.patients.total}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-purple-500 shadow-md">
          <CardHeader>
            <CardTitle>Total Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{data.doctors.total}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white">
          <CardHeader>
            <CardTitle>Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Today: {data.consultations.today} {renderChange(data.consultations.today, data.consultations.yesterday)}</p>
            <p>This Week: {data.consultations.week} {renderChange(data.consultations.week, data.consultations.lastWeek)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-teal-500 to-teal-700 text-white">
          <CardHeader>
            <CardTitle>Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Today: {data.patients.today} {renderChange(data.patients.today, data.patients.yesterday)}</p>
            <p>This Week: {data.patients.week} {renderChange(data.patients.week, data.patients.lastWeek)}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
          <CardHeader>
            <CardTitle>Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Today: {data.doctors.today} {renderChange(data.doctors.today, data.doctors.yesterday)}</p>
            <p>This Week: {data.doctors.week} {renderChange(data.doctors.week, data.doctors.lastWeek)}</p>
            <p>Pending: {data.doctors.pending}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 shadow-md">
        <CardHeader>
          <CardTitle>Activity Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey={filter === "week" ? "Week" : "Today"}
                fill={filter === "week" ? "#34d399" : "#6366f1"}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-md">
        <CardHeader>
          <CardTitle>Speciality Distribution</CardTitle>
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
                fill="#8884d8"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                onClick={handleSliceClick}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}`, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminDashboard;
