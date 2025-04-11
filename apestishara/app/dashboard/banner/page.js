"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/lib/PageHeader";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent default form submission
    if (!file) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Uploaded");
        formData.file="";
        setFile("")
      } else {
        toast.error("Error while uploading");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error while uploading");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section">
      <PageHeader
        name="Banners"
        buttonText={"Add Banner"}
        method={showForm}
        state={isFormVisible}
      />
      {isFormVisible && (
        <form className="mb-6 p-4 border rounded-lg flex flex-col gap-3 mt-10">
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
            onClick={handleSubmit}
            className="w-[150px]"
            disabled={!file || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      )}
    </section>
  );
};

export default Page;
