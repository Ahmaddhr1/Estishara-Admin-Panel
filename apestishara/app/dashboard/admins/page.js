"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/lib/PageHeader";
import Loading from "@/lib/Loading";
import Alert from "@/lib/Alert";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner"; // ✅ using sonner toast now

// Fetch admins
const fetchAdmins = async () => {
  const token = localStorage.getItem("token"); // assuming the token is stored in localStorage
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

const Page = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubLoading, setIsSubLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: fetchAdmins,
  });

  const createAdmin = useMutation({
    mutationFn: (formData) => {
      const token = localStorage.getItem("token");
      return axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Admin created successfully");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setIsFormVisible(false);
    },
    onError: (e) => {
      toast.error(e.response?.data?.message || "Failed to create admin");
    },
    onSettled: () => {
      setIsSubLoading(false);
      setFormData({ username: "", password: "" });
    },
  });

  const deleteAdmin = useMutation({
    mutationFn: (id) => {
      const token = localStorage.getItem("token");
      return axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Admin deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (e) => {
      toast.error(e.response?.data?.message || "Failed to delete admin");
    },
    onSettled: () => setDeleteLoading(false),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubLoading(true);
    createAdmin.mutate(formData);
  };

  const handleDelete = (id) => {
    setDeleteLoading(true);
    deleteAdmin.mutate(id);
  };

  const showForm = () => {
    setIsFormVisible(!isFormVisible);
    if (!isFormVisible) {
      setFormData({ username: "", password: "" });
    }
  };

  const storedAdmin =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("admin"))
      : null;

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
                      Submitting...
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
                  const isSelf = storedAdmin && storedAdmin.id === admin._id;
                  return (
                    <TableRow key={admin._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {admin.username}
                        {isSelf && (
                          <span className="text-gray-500 ml-3">
                            (You're logged in)
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {!isSelf ? (
                          <Alert
                            loading={deleteLoading}
                            trigger="Delete"
                            title="Are you sure?"
                            des="This action cannot be undone. This will permanently delete the admin account."
                            action="Delete"
                            func={handleDelete}
                            para={admin._id}
                            Icon={Trash2}
                          />
                        ) : (
                          "-"
                        )}
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
