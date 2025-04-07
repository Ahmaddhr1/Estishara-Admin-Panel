"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Trash2, Search, X } from "lucide-react";
import { toast } from "sonner"; // ✅ using sonner toast globally
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

const fetchPatients = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/patient`
  );
  return data;
};

const deletePatient = async (id) => {
  await axios.delete(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/patient/${id}`
  );
};

const Page = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    data: patients = [],
    isLoading,
  } = useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
    staleTime: 5 * 60 * 1000,
    onError: (err) => {
      toast.error(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while fetching patients"
      );
    },
  });

  const mutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      toast.success("Patient deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (err) => {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to delete patient"
      );
    },
    onSettled: () => setDeleteLoading(false),
  });

  const handleDelete = (id) => {
    setDeleteLoading(true);
    mutation.mutate(id);
  };

  const filteredPatients = useMemo(() => {
    if (!Array.isArray(patients)) return [];

    const lowerSearchTerm = searchTerm.toLowerCase();

    return patients.filter((patient) => {
      const name = String(patient.name || "").toLowerCase();
      const email = String(patient.email || "").toLowerCase();
      const phoneNumber = String(patient.phoneNumber || "").toLowerCase();

      return (
        name.includes(lowerSearchTerm) ||
        email.includes(lowerSearchTerm) ||
        phoneNumber.includes(lowerSearchTerm)
      );
    });
  }, [searchTerm, patients]);

  if (isLoading) {
    return (
      <section className="section">
        <PageHeader name="Patients" isFormVisible={false} />
        <Loading />
      </section>
    );
  }

  return (
    <section className="section">
      <PageHeader name="Patients" isFormVisible={false} />

      {/* Search */}
      <div className="mt-10">
        <div className="relative max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, email or phone..."
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
        <TableCaption>A list of all patients.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPatients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                {searchTerm
                  ? "No matching patients found"
                  : "No patients available"}
              </TableCell>
            </TableRow>
          ) : (
            filteredPatients.map((patient, index) => (
              <TableRow key={patient._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{patient.name || "-"}</TableCell>
                <TableCell>{patient.email || "-"}</TableCell>
                <TableCell>{patient.age || "-"}</TableCell>
                <TableCell>{patient.phoneNumber || "-"}</TableCell>
                <TableCell>
                  <Alert
                    loading={deleteLoading}
                    trigger="Delete"
                    title="Are you sure?"
                    des="This will permanently delete the patient record."
                    action="Delete"
                    func={handleDelete}
                    para={patient._id}
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
