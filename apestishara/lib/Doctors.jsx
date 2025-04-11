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
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctor/`
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch doctors"
    );
  }
};

const deleteDoctor = async (id) => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) throw new Error("Authentication token not found");
    
    await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctor/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete doctor"
    );
  }
};

const Doctors = ({ searchTerm = "" }) => {
  const queryClient = useQueryClient();
  const [deleteLoading, setDeleteLoading] = useState(null);

  const { data: doctors = [], isLoading, error } = useQuery({
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
    onError: (err) => {
      toast.error(err.message || "Failed to delete doctor");
    },
    onSettled: () => setDeleteLoading(null),
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const filteredDoctors = useMemo(() => {
    if (!Array.isArray(doctors)) return [];
    const lowerSearchTerm = searchTerm.toLowerCase();

    return doctors.filter((doctor) => {
      const name = String(doctor?.name || "").toLowerCase();
      const email = String(doctor?.email || "").toLowerCase();
      const specialty = String(doctor?.specialityId?.title || "").toLowerCase();

      return (
        name.includes(lowerSearchTerm) ||
        email.includes(lowerSearchTerm) ||
        specialty.includes(lowerSearchTerm)
      );
    });
  }, [searchTerm, doctors]);

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error.message || "Failed to load doctors"}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="mt-3">
        <TableCaption>A list of all the official doctors</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Specialty</TableHead>
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
            filteredDoctors.map((doctor, index) => (
              <TableRow key={doctor?._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{doctor?.name || "-"}</TableCell>
                <TableCell>{doctor?.email || "-"}</TableCell>
                <TableCell>{doctor?.specialityId?.title || "-"}</TableCell>
                <TableCell>
                  {doctor?.phoneNumber ? (
                    <a
                      href={`https://wa.me/+${doctor.phoneNumber}`}
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
                  {doctor?.documents?.length > 0 ? (
                    doctor.documents.map((doc, i) => (
                      <React.Fragment key={i}>
                        <a
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-primary mr-2"
                        >
                          Document {i + 1}
                        </a>
                        {i < doctor.documents.length - 1 && ", "}
                      </React.Fragment>
                    ))
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                <Alert
                  loading={deleteLoading === doctor?._id}
                  trigger="Delete"
                  title="Are you sure?"
                  des="This will permanently delete the doctor record."
                  action="Delete"
                  func={handleDelete}
                  para={doctor?._id}
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