"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Trash2, Pencil } from "lucide-react";
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
import { toast } from "sonner"; // ✅ sonner toast

// Fetch specialities without authorization
const fetchSpecialities = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/speciality/`
  );
  return Array.isArray(data) ? data : [];
};

const Page = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    file: null,
    existingLogo: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubLoading, setIsSubLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const { data: specialities = [], isLoading } = useQuery({
    queryKey: ["specialities"],
    queryFn: fetchSpecialities,
  });

  const specialityMutation = useMutation({
    mutationFn: async ({ name, file, existingLogo, id }) => {
      let logo = existingLogo;

      if (file) {
        const uploadForm = new FormData();
        uploadForm.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });

        if (!uploadRes.ok) {
          const errorText = await uploadRes.text();
          throw new Error(`Upload failed: ${errorText}`);
        }

        const uploadData = await uploadRes.json();
        logo = uploadData.url;
      }

      if (!logo) throw new Error("Logo is required.");

      const payload = {
        title: name,
        logo,
        description: "description should be here",
      };

      const token = sessionStorage.getItem("token"); // Get the JWT token
      const headers = { Authorization: `Bearer ${token}` }; // Set the token in headers

      if (id) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/speciality/${id}`,
          payload,
          { headers }
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/speciality/`,
          payload,
          { headers }
        );
      }
    },
    onSuccess: () => {
      toast.success(
        `Speciality ${isEditMode ? "updated" : "created"} successfully`
      );
      queryClient.invalidateQueries({ queryKey: ["specialities"] });
      setIsFormVisible(false);
      setIsEditMode(false);
      setEditId(null);
    },
    onError: (e) => {
      toast.error(e.response?.data?.message || "Failed to submit");
    },
    onSettled: () => {
      setIsSubLoading(false);
      setFormData({ name: "", file: null, existingLogo: "" });
    },
  });

  const deleteSpeciality = useMutation({
    mutationFn: (id) => {
      const token = sessionStorage.getItem("token"); // Get the JWT token
      const headers = { Authorization: `Bearer ${token}` }; // Set the token in headers

      return axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/speciality/${id}`,
        { headers }
      );
    },
    onSuccess: () => {
      toast.success("Speciality deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["specialities"] });
    },
    onError: (e) => {
      toast.error(e.response?.data?.message || "Failed to delete speciality");
    },
    onSettled: () => setDeleteLoading(false),
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData((prev) => ({ ...prev, file: files?.[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubLoading(true);
    specialityMutation.mutate({
      name: formData.name,
      file: formData.file,
      existingLogo: formData.existingLogo,
      id: isEditMode ? editId : null,
    });
  };

  const handleDelete = (id) => {
    setDeleteLoading(true);
    deleteSpeciality.mutate(id);
  };

  const showForm = () => {
    setIsFormVisible(!isFormVisible);
    if (!isFormVisible) {
      setFormData({ name: "", file: null, existingLogo: "" });
      setIsEditMode(false);
      setEditId(null);
    }
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setEditId(item._id);
    setFormData({ name: item.title, file: null, existingLogo: item.logo });
    setIsFormVisible(true);
  };

  return (
    <section className="section">
      <PageHeader
        name="Specialities"
        buttonText={isEditMode ? "Cancel Edit" : "Add Speciality"}
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
                  name="name"
                  placeholder="Speciality Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />

                {isEditMode && formData.existingLogo && (
                  <img
                    src={formData.existingLogo}
                    alt="Current Logo"
                    className="h-16 w-16 object-cover rounded border"
                  />
                )}

                <Input
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  required={!isEditMode}
                />

                <Button type="submit" disabled={isSubLoading}>
                  {isSubLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Submitting..."}
                    </>
                  ) : isEditMode ? (
                    "Update"
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </form>
          )}

          <Table className="mt-10">
            <TableCaption>A list of all specialities.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead className="text-right">Doctors</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specialities.length > 0 ? (
                specialities.map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      {item.logo ? (
                        <img
                          src={item.logo}
                          alt={item.title}
                          width={50}
                          height={50}
                          className="object-cover rounded"
                        />
                      ) : (
                        <span className="text-sm text-gray-400">No logo</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.doctors?.length || 0}
                    </TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="md:flex hidden">Edit</span>
                      </Button>
                      <Alert
                        loading={deleteLoading}
                        trigger="Delete"
                        title="Are you sure?"
                        des="This action cannot be undone. It will permanently delete this speciality."
                        action="Delete"
                        func={handleDelete}
                        para={item._id}
                        Icon={Trash2}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
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
