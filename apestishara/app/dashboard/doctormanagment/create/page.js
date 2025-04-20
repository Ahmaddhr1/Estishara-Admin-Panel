"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/lib/PageHeader";
import React, { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import Loading from "@/lib/Loading";
import { useRouter } from "next/navigation";

// Fetch specialities data
const fetchSpecialities = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/speciality`
  );
  return response.data;
};

const DoctorRegistration = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpToken, setOtpToken] = useState("");
  const [documents, setDocuments] = useState([]); // Stores file URLs after upload
  const [isUploading, setIsUploading] = useState(false); // Uploading status
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    dob: "",
    phoneNumber: "",
    respondTime: "",
    consultationFee: "",
    specialityId: "",
    age: 0,
    otp: null,
    password: "",
    confirmPassword: "",
  });

  const {
    data: specialities,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["specialities"],
    queryFn: fetchSpecialities,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    if (otpToken) return;

    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "dob") {
      const age = calculateAge(value);
      setFormData((prevData) => ({
        ...prevData,
        age: age,
      }));
    }

    console.log("Form Data on Input Change:", formData);
  };

  // Handle file input change and upload files
  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setDocuments(filesArray);
      console.log("Documents selected:", filesArray);
      uploadFiles(filesArray); // Trigger the upload process
    }
  };

  // Upload files to the server and store URLs
  const uploadFiles = async (files) => {
    setIsUploading(true); // Show upload status
    const uploadedDocuments = []; // Array to store file URLs

    for (let file of files) {
      const uploadForm = new FormData();
      uploadForm.append("file", file); // Append each file to the form

      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });

        if (!uploadRes.ok) {
          const errorText = await uploadRes.text();
          throw new Error(`Upload failed: ${errorText}`);
        }

        const uploadData = await uploadRes.json();
        uploadedDocuments.push(uploadData.url); // Store the URL
        console.log("File uploaded successfully:", uploadData.url);
      } catch (error) {
        console.error("File upload error:", error);
        toast.error("File upload failed!");
        setIsUploading(false);
        return; // Exit early if an error occurs
      }
    }

    setDocuments(uploadedDocuments); // Update the state with file URLs
    console.log("Documents after upload:", uploadedDocuments);
    setIsUploading(false); // Hide upload status
  };

  // Calculate the age based on the date of birth
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    if (
      month < birthDate.getMonth() ||
      (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    console.log("Calculated Age:", age);
    return age;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Form Data on Submit:", formData);

    try {
      if (!otpToken) {
        // Request OTP
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/request-otp`,
          {
            email: formData.email,
            phoneNumber: formData.phoneNumber,
          }
        );

        setOtpToken(response.data.otpToken);
        toast.success("OTP sent successfully!");
        console.log(
          "OTP sent successfully, OTP Token:",
          response.data.otpToken
        );
      } else {
        // Register Doctor
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          setIsSubmitting(false);
          return;
        }

        console.log("Form DATA on Registration:", JSON.stringify(formData, null, 2));

        const uploadedDocuments = documents; // URLs of uploaded documents
        console.log("Uploaded Documents:", uploadedDocuments);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/doctor/register`,
          {
            email: formData.email,
            password: formData.password,
            phoneNumber: formData.phoneNumber,
            name: formData.name,
            lastName: formData.lastName,
            age: formData.age,
            specialityId: formData.specialityId,
            respondTime: formData.respondTime,
            consultationFees: formData.consultationFee,
            otpToken: otpToken,
            otpCode: parseInt(formData.otp),
            documents: uploadedDocuments, // Sending the URLs of uploaded documents
          }
        );

        console.log("Doctor Registration Response:", response);
        toast.success("Doctor registered successfully!");
        router.push("/dashboard/doctormanagment")
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    toast.error("Error fetching specialities: " + error.message);
    return <div>Error fetching specialities</div>;
  }

  return (
    <section className="section p-4">
      <PageHeader name="Add Doctor" isFormVisible={false} />

      <form className="flex flex-col gap-6 mt-10" onSubmit={handleSubmit}>
        {/* Personal Info Section */}
        <div>
          <h2 className="font-semibold mb-2">Personal Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              required
              type="text"
              placeholder="First Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full"
              disabled={!!otpToken}
            />
            <Input
              required
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full"
              disabled={!!otpToken}
            />
            <Input
              required
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!!otpToken}
            />
            <Input
              required
              type="date"
              placeholder="Date of Birth"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full"
              disabled={!!otpToken}
            />
            <Input
              required
              type="tel"
              placeholder="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full"
              disabled={!!otpToken}
            />
          </div>
        </div>

        {/* Password Section */}
        <div>
          <h2 className="font-semibold mb-2">Account Security</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              required
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full"
              disabled={!!otpToken}
            />
            <Input
              required
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full"
              disabled={!!otpToken}
            />
          </div>
        </div>

        {/* Documents Section */}
        <div>
          <h2 className="font-semibold mb-2">Professional Documents</h2>
          <Input
            type="file"
            name="documents"
            multiple
            onChange={handleFileChange}
            className="w-full"
            disabled={!!otpToken}
            ref={fileInputRef}
          />
        </div>

        {/* Platform Info Section */}
        <div>
          <h2 className="font-semibold mb-2">Platform Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              required
              type="number"
              placeholder="Respond Time (hours)"
              name="respondTime"
              value={formData.respondTime}
              onChange={handleInputChange}
              className="w-full"
              disabled={!!otpToken}
            />
            <Input
              required
              type="number"
              placeholder="Consultation Fee"
              name="consultationFee"
              value={formData.consultationFee}
              onChange={handleInputChange}
              className="w-full"
              disabled={!!otpToken}
            />
            <Input
              required
              type="text"
              placeholder="Select Speciality"
              name="specialityId"
              value={formData.specialityId}
              onChange={handleInputChange}
              list="speciality"
              className="w-full"
              disabled={!!otpToken}
            />
            <datalist id="speciality">
              {specialities?.map((speciality) => (
                <option key={speciality._id} value={speciality._id}>
                  {speciality.title}
                </option>
              ))}
            </datalist>
          </div>
        </div>

        {/* OTP Section */}
        {otpToken && (
          <div>
            <h2 className="font-semibold mb-2">OTP Verification</h2>
            <Input
              type="text"
              placeholder="Enter OTP"
              name="otp"
              value={formData.otp}
              onChange={(e) =>
                setFormData({ ...formData, otp: e.target.value })
              }
              className="w-full"
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-4">
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {otpToken
              ? isSubmitting
                ? "Registering..."
                : "Register Doctor"
              : isSubmitting
              ? "Requesting OTP..."
              : "Request OTP"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default DoctorRegistration;
