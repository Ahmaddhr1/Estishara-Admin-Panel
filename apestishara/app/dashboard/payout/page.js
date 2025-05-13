"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Loading from "@/lib/Loading";

// Fetch function for pending payouts
const fetchPendingPayouts = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultation/payouts/pending`
  );
  return data?.consultations || [];
};

const updatePayoutStatus = async (id) => {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/consultation/payout/${id}`
  );
  return response.data;
};

const Page = () => {
  const queryClient = useQueryClient();

  // Use React Query to fetch the data
  const { data, isLoading, error } = useQuery({
    queryKey: ["pendingPayouts"],
    queryFn: fetchPendingPayouts,
  });

  const mutation = useMutation({
    mutationFn: updatePayoutStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingPayouts"]);
      toast.success("Payout status updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update payout status");
    },
  });

  const handlePayoutClick = (id) => {
    mutation.mutate(id);
  };

  if (isLoading) {
    return <Loading/>;
  }

  if (error) {
    return <p className="text-red-500">Failed to load pending payouts</p>;
  }

  return (
    <section className="section p-6">
      <h2 className="font-bold text-lg mb-4">PayOut</h2>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableCaption>A list of pending payout consultations</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Payout Status</TableHead>
              <TableHead>Preferred Payout Method</TableHead>
              <TableHead>Doctor Fees</TableHead>
              <TableHead>Amount to Send</TableHead>
              <TableHead>Payout Account Number</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((consultation, index) => (
              <TableRow key={consultation._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {consultation?.doctorId?.name}{" "}
                  {consultation?.doctorId?.lastName}
                </TableCell>
                <TableCell>
                  <a
                    href={`https://wa.me/+${consultation?.doctorId?.phoneNumber}`}
                    target="_blank"
                    className="text-green-600 underline"
                  >
                    {consultation?.doctorId?.phoneNumber}
                  </a>
                </TableCell>
                <TableCell className="">
                  <span className=" p-2 rounded-md bg-red-300 text-red-700">
                    Pending
                  </span>
                </TableCell>
                <TableCell>
                  {consultation?.doctorId?.preferredPayoutMethod}
                </TableCell>
                <TableCell>
                  {consultation?.doctorId?.consultationFees}$
                </TableCell>
                <TableCell>
                  {(consultation?.doctorId?.consultationFees * 80) / 100} $
                </TableCell>
                <TableCell>
                  {consultation?.doctorId?.payoutAccountNumber
                    ? consultation?.doctorId?.payoutAccountNumber
                    : "-"}
                </TableCell>
                <TableCell className="flex items-center justify-center">
                  <Button onClick={() => handlePayoutClick(consultation._id)}>
                    <SendIcon className="w-5" />
                    Amount Sent
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default Page;
