"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import Loading from "@/lib/Loading";

const fetchFeedbacks = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/feedback`
  );
  return data;
};

const FeedbackPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: fetchFeedbacks,
  });

  if (isLoading) return <Loading />;
  if (error) {
    toast.error("Failed to fetch feedbacks");
    return <p className="text-red-500">Error loading feedbacks</p>;
  }

  return (
    <section className="section p-6">
      <h2 className="font-bold text-lg mb-4">Feedbacks</h2>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableCaption>A list of all submitted feedbacks</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Doctor Phone</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Patient Phone</TableHead>
              <TableHead>Stars</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((fb, index) => (
              <TableRow key={fb._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {fb?.doctor?.name} {fb?.doctor?.lastName}
                </TableCell>
                <TableCell>
                  <a
                    href={`https://wa.me/+${fb?.doctor?.phoneNumber}`}
                    target="_blank"
                    className="text-green-600 underline"
                  >
                    {fb?.doctor?.phoneNumber || "-"}
                  </a>
                </TableCell>
                <TableCell>
                  {fb?.patient?.name} {fb?.patient?.lastName}
                </TableCell>
                <TableCell>
                  <a
                    href={`https://wa.me/+${fb?.patient?.phoneNumber}`}
                    target="_blank"
                    className="text-green-600 underline"
                  >
                    {fb?.patient?.phoneNumber || "-"}
                  </a>
                </TableCell>
                <TableCell>{fb?.stars ? `${fb.stars} ⭐` : "-"}</TableCell>
                <TableCell>{fb?.feedback}</TableCell>
                <TableCell>
                  {fb?.isReport ? (
                    <span className="bg-red-200 text-red-700 px-2 py-1 rounded">
                      Report
                    </span>
                  ) : (
                    <span className="bg-green-200 text-green-700 px-2 py-1 rounded">
                      Feedback
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default FeedbackPage;
