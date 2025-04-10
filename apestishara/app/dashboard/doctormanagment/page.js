"use client";

import React, { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Trash2, Search, X, UserRoundCheck } from "lucide-react";
import PageHeader from "@/lib/PageHeader";
import Alert from "@/lib/Alert";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PendingDoctors from "@/lib/PendingDoctors";
import Doctors from "@/lib/Doctors";

const Page = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <section className="section">
      <PageHeader name="Doctors Management" isFormVisible={false} />

      <div className="mt-5">
        {/* Tabs */}
        <div className="flex space-x-4 mb-4">
          <Button
            variant={activeTab==="pending" ? "default" :"outline"}
            onClick={() => setActiveTab("pending")}
          >
            Pending Doctors
          </Button>
          <Button
           variant={activeTab=== "approved"? "default" :"outline"}
            onClick={() => setActiveTab("approved")}
          >
            Approved Doctors
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, email, or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Render Active Tab Content */}
        {activeTab === "pending" && <PendingDoctors searchTerm={searchTerm} />}
        {activeTab === "approved" && <Doctors searchTerm={searchTerm} />}
      </div>
    </section>
  );
};

export default Page;
