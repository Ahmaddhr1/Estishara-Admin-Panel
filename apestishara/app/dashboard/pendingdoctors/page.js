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
import Loading from "@/lib/Loading";

// Fetch doctors with authorization token
const fetchDoctors = async () => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctor`);
  return data;
};

// Approve doctor
const approveDoctor = async (id) => {
  const { data } = await axios.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors/approve/${id}`
  );
  return data;
};

const Page = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false); // For handling approve loading

  const {
    data: doctors = [],
    isLoading,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
    staleTime: 5 * 60 * 1000,
    onError: (err) => {
      toast.error(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while fetching doctors"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctor/${id}`),
    onSuccess: () => {
      toast.success("Doctor deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete doctor"
      );
    },
    onSettled: () => setDeleteLoading(false),
  });

  const approveMutation = useMutation({
    mutationFn: approveDoctor,
    onSuccess: () => {
      toast.success("Doctor approved successfully");
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to approve doctor"
      );
    },
    onSettled: () => setApproveLoading(false),
  });

  const handleDelete = (id) => {
    setDeleteLoading(true);
    deleteMutation.mutate(id);
  };

  const handleApprove = (id) => {
    setApproveLoading(true);
    approveMutation.mutate(id);
  };

  const filteredDoctors = useMemo(() => {
    if (!Array.isArray(doctors)) return [];

    const lowerSearchTerm = searchTerm.toLowerCase();

    return doctors.filter((doctor) => {
      const name = String(doctor.name || "").toLowerCase();
      const email = String(doctor.email || "").toLowerCase();
      const specialty = String(doctor.specialty || "").toLowerCase();

      return (
        name.includes(lowerSearchTerm) ||
        email.includes(lowerSearchTerm) ||
        specialty.includes(lowerSearchTerm)
      );
    });
  }, [searchTerm, doctors]);

  if (isLoading) {
    return (
      <section className="section">
        <PageHeader name="Pending Doctors" isFormVisible={false} />
        <Loading />
      </section>
    );
  }

  return (
    <section className="section">
      <PageHeader name="Doctors" isFormVisible={false} />

      {/* Search */}
      <div className="mt-10">
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
      </div>

      {/* Table */}
      <Table className="mt-3">
        <TableCaption>A list of all doctors.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Specialty</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Files</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDoctors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                {searchTerm
                  ? "No matching doctors found"
                  : "No doctors available"}
              </TableCell>
            </TableRow>
          ) : (
            filteredDoctors.map((doctor, index) => (
              <TableRow key={doctor._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{doctor.name || "-"}</TableCell>
                <TableCell>{doctor.email || "-"}</TableCell>
                <TableCell>{doctor.specialty || "-"}</TableCell>
                <TableCell>{doctor.phoneNumber || "-"}</TableCell>
                <TableCell>
                  {/* Handle the files */}
                  {doctor.documents && doctor.documents.length > 0 ? (
                    doctor.documents.map((doc, docIndex) => (
                      <div key={docIndex}>
                        <a href={doc} target="_blank" rel="noopener noreferrer">
                          Document {docIndex + 1}
                        </a>
                      </div>
                    ))
                  ) : (
                    <span>No documents available</span>
                  )}
                </TableCell>
                <TableCell>
                  <Alert
                    loading={approveLoading}
                    trigger="Approve"
                    title="Are you sure?"
                    des="This will permanently accept the doctor and will be officially visible to patients."
                    action="Approve"
                    func={handleApprove}
                    para={doctor._id}
                    Icon={UserRoundCheck}
                    variant="outline"
                  />
                  <Alert
                    loading={deleteLoading}
                    trigger="Delete"
                    title="Are you sure?"
                    des="This will permanently delete the doctor record."
                    action="Delete"
                    func={handleDelete}
                    para={doctor._id}
                    Icon={Trash2}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </section>
  );
};

export default Page;
