"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/public/logo2.png"
import Image from "next/image";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !password) {
      toast.error("Please enter all fields");
      setIsLoading(false);
      return;
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      toast.error("Backend URL is not configured");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/api/admin/login`, {
        username,
        password,
      });

      if (res?.data.token) {
        const { token, admin } = res.data;
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("admin", JSON.stringify(admin));
        router.push("/dashboard");
      } else {
        toast.error(res?.data?.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen w-full font-sans">
      {/* Left Side */}
      <div className="flex flex-col md:items-start items-center justify-center gap-8 w-full md:w-2/3 md:px-20">
        <div className="flex items-center md:items-start flex-col">
          <Image 
          src={Logo}
          alt="Logo"
          width="200"
          height="100"
          className="mb-10 md:w-[300px]"
          />
          <h1 className="text-xl font-bold">Hey Admin, 👋</h1>
          <p className="text-gray-800">Please enter your credentials</p>
        </div>

        <form
          className="md:max-w-[400px] w-full md:px-0 px-8"
          onSubmit={handleSubmit}
          method="POST"
        >
          <div className="flex flex-col gap-4 mb-4">
            <Input
              type="text"
              placeholder="Username"
              className="w-full p-3 text-sm md:text-md h-12 md:h-10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              className="w-full p-3 text-sm md:text-md h-12 md:h-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="w-full md:w-[120px]">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !username || !password}
              className="w-full md:h-10 h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Logging In...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </form>

        {/* ⚠️ Alert for non-admins */}
        <p className="text-center text-sm text-gray-600 px-4 mt-6">
          ⚠️ This section is strictly for admins only. Unauthorized access is not allowed.
        </p>
      </div>

      {/* Right Image */}
      <div className="hidden md:block w-1/3 h-screen">
        <img
          src="/doctor.jpg"
          alt="Doctor"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
