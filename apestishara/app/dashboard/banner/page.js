"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Alert from "@/lib/Alert";
import Loading from "@/lib/Loading";
import PageHeader from "@/lib/PageHeader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

const fetchBanners = async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/banner`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

const Page = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [isSubLoading, setIsSubLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const queryClient = useQueryClient();

  const showForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchBanners,
    staleTime: 5 * 60 * 1000,
    onError: (err) => {
      toast.error("An unknown error occurred while fetching banners");
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/banner/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Banner deleted successfully");
      queryClient.invalidateQueries(["banners"]);
    },
    onError: (err) => {
      toast.error("Failed to delete banner");
    },
  });

  const handleDelete = (id) => {
    setDeleteLoading(true);
    deleteMut.mutate(id, {
      onSettled: () => setDeleteLoading(false),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setIsSubLoading(true);

    try {
      // Step 1: Upload the file to cloud or local API
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        toast.success("Image uploaded");

        const token = localStorage.getItem("token");
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/banner/`,
          { img: data.url },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFile(null);
        queryClient.invalidateQueries(["banners"]);
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload error");
    } finally {
      setIsSubLoading(false);
    }
  };
  if (isLoading) {
    return (
      <>
        <PageHeader
          name="Banners"
          buttonText={"Add Banner"}
          method={showForm}
          state={isFormVisible}
        />
        <Loading />
      </>
    );
  }

  return (
    <section className="section">
      <PageHeader
        name="Banners"
        buttonText={"Add Banner"}
        method={showForm}
        state={isFormVisible}
      />
      {isFormVisible && (
        <form
          className="mb-6 p-4 border rounded-lg flex flex-col gap-3 mt-10"
          onSubmit={handleSubmit}
        >
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file && (
            <Image
              src={URL.createObjectURL(file)}
              width={200}
              height={200}
              alt="Preview"
              className="rounded-md"
            />
          )}
          <Button
            type="submit"
            className="w-[150px]"
            disabled={!file || isSubLoading}
          >
            {isSubLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      )}

      <div className="flex gap-4 flex-wrap">
        {banners?.length ? (
          banners?.map((banner) => (
            <div
              key={banner?._id}
              className="flex flex-col items-center gap-2 mt-6"
            >
              <img
                src={banner?.img}
                width={200}
                className="h-[200px] object-cover"
                alt="Banner"
              />
              <p>{banner._id}</p>
              <Alert
                loading={deleteLoading}
                trigger="Delete"
                title="Are you sure?"
                des="This will permanently delete the banner."
                action="Delete"
                func={() => handleDelete(banner?._id)}
                para={banner?._id}
                Icon={Trash2}
              />
            </div>
          ))
        ) : (
          <p>No banner found! Create one</p>
        )}
      </div>
    </section>
  );
};

export default Page;
