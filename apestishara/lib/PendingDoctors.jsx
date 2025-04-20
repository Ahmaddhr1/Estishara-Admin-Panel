"use client";
import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Trash2, UserRoundCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Alert from "@/lib/Alert";
import Loading from "@/lib/Loading";

const fetchPendingDoctors = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctor/pending`
  );
  return Array.isArray(data) ? data : [];
};

const approveDoctor = async (id) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctor/approve/${id}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

const PendingDoctors = ({ searchTerm = "" }) => {
  const queryClient = useQueryClient();
  const [approveLoading, setApproveLoading] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["pendingDoctors"],
    queryFn: fetchPendingDoctors,
    staleTime: 5 * 60 * 1000,
    retry: false,
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to fetch pending doctors"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      const token = localStorage.getItem("token");
      return axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctor/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: () => {
      toast.success("Doctor deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["pendingDoctors"] });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Delete failed"),
    onSettled: () => setDeleteLoading(null),
  });

  const approveMutation = useMutation({
    mutationFn: approveDoctor,
    onSuccess: () => {
      toast.success("Doctor approved successfully");
      queryClient.invalidateQueries({ queryKey: ["pendingDoctors"] });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Approval failed"),
    onSettled: () => setApproveLoading(null),
  });

  const handleDelete = (id) => {
    setDeleteLoading(id);
    deleteMutation.mutate(id);
  };

  const handleApprove = (id) => {
    setApproveLoading(id);
    approveMutation.mutate(id);
  };

  const filteredDoctors = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return doctors.filter((d) =>
      [d.name, d.email, d.specialityId?.title].some((v) =>
        (v || "").toLowerCase().includes(term)
      )
    );
  }, [searchTerm, doctors]);

  if (isLoading) return <Loading />;

  return (
    <Table className="mt-3">
      <TableCaption>List of all pending doctors</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Speciality</TableHead>
          <TableHead>Phone Number</TableHead>
          <TableHead>Documents</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredDoctors.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              {searchTerm
                ? "No matching doctors found"
                : "No pending doctors available"}
            </TableCell>
          </TableRow>
        ) : (
          filteredDoctors.map((doc, i) => (
            <TableRow key={doc._id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{doc.name || "-"}</TableCell>
              <TableCell>{doc.email || "-"}</TableCell>
              <TableCell>{doc.specialityId?.title || "-"}</TableCell>
              <TableCell>
                <a
                  href={`https://wa.me/+${doc.phoneNumber}`}
                  target="_blank"
                  className="text-green-600 underline"
                >
                  WhatsApp
                </a>
              </TableCell>
              <TableCell>
                {doc.documents?.length > 0
                  ? doc.documents.map((url, j) => (
                      <a
                        key={j}
                        href={url}
                        target="_blank"
                        className="underline text-primary mr-2"
                      >
                        Doc {j + 1}
                      </a>
                    ))
                  : "-"}
              </TableCell>
              <TableCell className="flex gap-2">
                <Alert
                  loading={approveLoading === doc._id}
                  trigger="Approve"
                  title="Approve Doctor?"
                  des="This doctor will be publicly available to patients."
                  action="Approve"
                  func={handleApprove}
                  para={doc._id}
                  Icon={UserRoundCheck}
                  variant="outline"
                />
                <Alert
                  loading={deleteLoading === doc._id}
                  trigger="Delete"
                  title="Delete Doctor?"
                  des="This will permanently delete the doctor's record."
                  action="Delete"
                  func={handleDelete}
                  para={doc._id}
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
