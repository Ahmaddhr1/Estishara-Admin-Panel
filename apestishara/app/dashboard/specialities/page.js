"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Loading from "@/lib/Loading";
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
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/lib/PageHeader";

const fetchSpecialities = async () => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/speciality/`);
  return data;
};

const Page = () => {
  const { toast } = useToast();
  const [isFormVisible, setIsFormVisible] = useState(false);

  const { data: specialities = [], isLoading} = useQuery({
    queryKey: ["specialities"],
    queryFn: fetchSpecialities,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (err) =>
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      }),
  });

  const showForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <section className="section">
      <PageHeader name="Specialities" buttonText="Add Speciality" method={showForm} state={isFormVisible} />
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {isFormVisible && (
            <form className="mb-6 p-4 border rounded-lg mt-5">
              <div className="space-y-4">
                <Input type="text" placeholder="Speciality Name" />
                <Input type="file" placeholder="Logo URL" />
                <Button type="submit">Submit</Button>
              </div>
            </form>
          )}
          <Table className="mt-10">
            <TableCaption>A list of all the specialities.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead className="text-right">Nb of doctors</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specialities.length > 0 ? (
                specialities.map((speciality, index) => (
                  <TableRow key={speciality._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{speciality.title}</TableCell>
                    <TableCell>
                      {speciality.logo && (
                        <img src={speciality.logo} alt={speciality.title} className="h-10 w-10 object-cover" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {speciality.doctors?.length || 0}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No specialities found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
};

export default Page;
