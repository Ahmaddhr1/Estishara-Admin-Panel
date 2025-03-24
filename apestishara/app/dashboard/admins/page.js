"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, X } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Page = () => {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isSubLoading, setIsSubLoading] = useState(false)

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/`
      );
      setAdmins(response?.data || []);
      setError(null);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to fetch admins");
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
      setAdmins(prevAdmins => [...prevAdmins, response.data.admin]);
      setIsFormVisible(false);
      setFormData({ username: "", password: "" });
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create admin");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/${id}`
      );
      setAdmins(prevAdmins => prevAdmins.filter(admin => admin._id !== id));
    } catch (e) {
      setError(e.response?.data?.message || "Failed to delete admin");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <section className="section">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Admins</h1>
        <Button onClick={showForm}>
          {isFormVisible ? "Cancel" : "Add Admin"}
          {isFormVisible ? <X className="ml-2" /> : <Plus className="ml-2" />}
        </Button>
      </div>
      {error && <div className="p-4 mb-4 text-red-500 bg-red-50 rounded-lg">{error}</div>}

      {isLoading ? (
        <Loading />
      ) : (
        <div className="mt-5">
          {isFormVisible && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg">
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
                  minLength="6"
                />
                <Button type="submit" disabled={isLoading}>
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
                admins.map((admin, index) => (
                  <TableRow key={admin._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {admin.username}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" disabled={isLoading}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the admin account.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="overflow-hidden">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(admin._id)}
                              disabled={deleteLoading}
                            >
                              {deleteLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : null}
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
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