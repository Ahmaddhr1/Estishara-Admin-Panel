"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import axios from "axios";
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

const Page = () => {
  const [specialities, setSpecialities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchSpecialities = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/api/speciality/"
      );
      console.log(response?.data);
      setSpecialities(response?.data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const showForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  useEffect(() => {
    fetchSpecialities();
  }, []);

  return (
    <section className="md:mt-0 mt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Specialities</h1>
        <Button onClick={showForm}>
          {isFormVisible ? "Cancel": "Add Speciality"}
          {isFormVisible ? <X />: <Plus className="ml-2" /> }
        </Button>
      </div>
      <div>
        {isLoading ? (
          <Loading />
        ) : error ? (
          <div className="text-red-500">{error}</div>
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
                {specialities.map((speciality, index) => (
                  <TableRow key={speciality._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {speciality.title}
                    </TableCell>
                    <TableCell>
                      {speciality.logo && (
                        <img 
                          src={speciality.logo} 
                          alt={speciality.title} 
                          className="h-10 w-10 object-cover"
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {speciality.doctors?.length || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;