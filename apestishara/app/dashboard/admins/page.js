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
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchAdmins = async () => {
    
    try {
      setIsLoading(true);
      // const response = await axios.get(
      //   process.env.NEXT_PUBLIC_BACKEND_URL + "/api/admin"
      // );
      // setAdmins(response.data);
      setError(null);
    } catch (e) {
      setError("Failed to fetch admins");
    } finally {
      setIsLoading(false);
    }
  };

  const showForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <section className="md:mt-0 mt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Admins</h1>
        <Button onClick={showForm}>
          {isFormVisible ? "Cancel" : "Add Admin"}{" "}
          {isFormVisible ? (
            <X className="ml-2" />
          ) : (
            <Plus className="ml-2" />
          )}{" "}
        </Button>
      </div>

      {isLoading ? (
        <Loading />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="mt-5">
          {isFormVisible && (
            <form className="mb-6 p-4 border rounded-lg">
              <div className="space-y-4">
                <Input type="text" placeholder="Admin Name" />
                <Input type="password" placeholder="Admin Password" />
                <Button type="submit">Submit</Button>
              </div>
            </form>
          )}

          <Table className="mt-10">
            <TableCaption>A list of all admins.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin, index) => (
                <TableRow key={admin._id}>
                  <TableCell>{index + 1}22</TableCell>
                  <TableCell className="font-medium">{admin.name}22</TableCell>
                  <TableCell>
                    <Button >Delete22</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
};

export default Page;
