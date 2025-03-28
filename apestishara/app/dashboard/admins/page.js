"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/lib/PageHeader";
import { useRouter } from "next/navigation";
import Alert from "@/lib/Alert";

const Page = () => {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isSubLoading, setIsSubLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/`
      );
      setAdmins(response?.data || []);
    } catch (e) {
      console.error("Fetch Admins Error:", e);
      toast({
        variant: "destructive",
        title: "Error",
        description: String(
          e.response?.data?.message || "Failed to fetch admins"
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showForm = () => {
    setIsFormVisible(!isFormVisible);
    if (!isFormVisible) {
      setFormData({ username: "", password: "" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/`,
        formData
      );
      toast({
        title: "Success",
        description: "Admin created successfully",
      });
      setAdmins((prevAdmins) => [...prevAdmins, response.data.admin]);
      setIsFormVisible(false);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: String(
          e.response?.data?.message || "Failed to create admin"
        ),
      });
    } finally {
      setIsSubLoading(false);
      setFormData({ username: "", password: "" });
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/${id}`
      );
      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== id));
      toast({
        variant: "success",
        title: "Success",
        description: "Admin deleted successfully",
      });
    } catch (e) {
      console.error("Delete Admin Error:", e);
      toast({
        variant: "destructive",
        title: "Error",
        description: String(
          e.response?.data?.message || "Failed to delete admin"
        ),
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const storedAdmin = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("admin")) : null;

  return (
    <section className="section">
      <PageHeader
        name="Admins"
        buttonText="Add Admin"
        method={showForm}
        state={isFormVisible}
      />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="mt-5">
          {isFormVisible && (
            <form
              onSubmit={handleSubmit}
              className="mb-6 p-4 border rounded-lg"
            >
              <div className="space-y-4">
                <Input
                  type="text"
                  name="username"
                  placeholder="Admin Name"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Admin Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                />
                <Button type="submit" disabled={isSubLoading}>
                  {isSubLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
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
              {admins.length > 0 ? (
                admins.map((admin, index) => {
                  if (storedAdmin && storedAdmin.id === admin._id) {
                    return (
                      <TableRow key={admin._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {admin.username}{" "}
                          <span className="text-gray-500 ml-3">
                            (You're logged in)
                          </span>
                        </TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                    );
                  }

                  return (
                    <TableRow key={admin._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {admin.username}
                      </TableCell>
                      <TableCell>
                        <Alert
                          loading={deleteLoading}
                          trigger="Delete"
                          title="Are you sure?"
                          des="This action cannot be undone. This will
                                permanently delete the admin account."
                          action="Delete"
                          func={handleDelete}
                          para={admin._id}
                          Icon={Trash2}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No admins found
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
