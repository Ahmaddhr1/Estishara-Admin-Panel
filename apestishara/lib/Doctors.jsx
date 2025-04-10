
"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Loading from "@/lib/Loading";

const fetchDoctors = async () => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctor/approved`);
  return data;
};

const Doctors = ({ searchTerm }) => {
  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["Doctors"],
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
            <TableCell colSpan={5} className="text-center">
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
              <TableCell>
                
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default Doctors;
