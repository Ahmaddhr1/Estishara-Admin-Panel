
"use client";

import React, { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Trash2, UserRoundCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Alert from "@/lib/Alert";
import Loading from "@/lib/Loading";

const fetchPendingDoctors = async () => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctor/pending`);
  return data;
};

const approveDoctor = async (id) => {
  const { data } = await axios.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors/approve/${id}`
  );
  return data;
};

const PendingDoctors = ({ searchTerm, deleteLoading, approveLoading }) => {
  const queryClient = useQueryClient();
  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["pendingDoctors"],
    queryFn: fetchPendingDoctors,
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
      queryClient.invalidateQueries({ queryKey: ["pendingDoctors"] });
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
      queryClient.invalidateQueries({ queryKey: ["pendingDoctors"] });
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
      const specialty = String(doctor.specialityId?.title || "").toLowerCase();

      return (
        name.includes(lowerSearchTerm) ||
        email.includes(lowerSearchTerm) ||
        specialty.includes(lowerSearchTerm)
      );
    });
  }, [searchTerm, doctors]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Table className="mt-3">
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Specialty</TableHead>
          <TableHead>Phone Number</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredDoctors.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
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
              <TableCell>{doctor.specialityId?.title || "-"}</TableCell>
              <TableCell>{doctor.phoneNumber || "-"}</TableCell>
              <TableCell className="flex gap-2">
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
  );
};

export default PendingDoctors;
