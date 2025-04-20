"use client";
import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from "@/lib/Loading";
import Alert from "@/lib/Alert";

const fetchDoctors = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctor/`
  );
  return Array.isArray(data) ? data : [];
};

const deleteDoctor = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authentication token not found");
  await axios.delete(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctor/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

const Doctors = ({ searchTerm = "" }) => {
  const queryClient = useQueryClient();
  const [deleteLoading, setDeleteLoading] = useState(null);

  const {
    data: doctors = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
    staleTime: 5 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDoctor,
    onMutate: (id) => setDeleteLoading(id),
    onSuccess: () => {
      toast.success("Doctor deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
    onError: (err) => toast.error(err.message || "Failed to delete doctor"),
    onSettled: () => setDeleteLoading(null),
  });

  const handleDelete = (id) => deleteMutation.mutate(id);

  const filteredDoctors = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return doctors.filter((d) =>
      [d.name, d.email, d.specialityId?.title].some((v) =>
        (v || "").toLowerCase().includes(term)
      )
    );
  }, [searchTerm, doctors]);

  if (isLoading) return <Loading />;
  if (error)
    return <div className="text-center py-8 text-red-500">{error.message}</div>;

  return (
    <div className="overflow-x-auto">
      <Table className="mt-3">
        <TableCaption>A list of all the official doctors</TableCaption>
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
                  : "No doctors available"}
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
                  {doc.phoneNumber ? (
                    <a
                      href={`https://wa.me/+${doc.phoneNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 underline"
                    >
                      Chat on WhatsApp
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {doc.documents?.length > 0
                    ? doc.documents.map((url, j) => (
                        <a
                          key={j}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-primary mr-2"
                        >
                          Doc {j + 1}
                        </a>
                      ))
                    : "-"}
                </TableCell>
                <TableCell>
                  <Alert
                    loading={deleteLoading === doc._id}
                    trigger="Delete"
                    title="Are you sure?"
                    des="This will permanently delete the doctor record."
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
    </div>
  );
};

export default Doctors;
