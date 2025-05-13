'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

// StatCard component with Tailwind colors
export function StatCard({ title, value, className = "" }) {
  return (
    <Card className={`bg-white duration-200 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-black">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-black">{value}</p>
      </CardContent>
    </Card>
  );
}

// Trend Card with "Today" and "Last Week" data and Tailwind colors
export function TrendCard({ title, current, previous, periodLabel, className = "" }) {
  const change = current - previous;
  const changePercentage = previous > 0 ? Math.round((change / previous) * 100) : 100;
  const isUp = change > 0;
  const isDown = change < 0;

  return (
    <Card className={`bg-white  duration-200 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-end">
        <div>
          <p className="text-2xl font-bold text-black">{current}</p>
          <p className="text-xs text-gray-600">{periodLabel}</p>
        </div>
        <div className={`flex items-center ${
          isUp ? `text-green-500` : 
          isDown ? `text-red-500` : 
          `text-gray-600`
        }`}>
          {isUp && <ArrowUp className="h-4 w-4 mr-1" />}
          {isDown && <ArrowDown className="h-4 w-4 mr-1" />}
          <span className="text-sm font-medium">
            {Math.abs(change)} ({Math.abs(changePercentage)}%)
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
