"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password");
      setIsLoading(false);
      return;
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      setError("Backend URL is not configured");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/api/admin/`, {
        username,
        password,
      });

      if (res?.data.token) {
        const { token, admin, message } = res.data;
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("admin", JSON.stringify(admin));
        console.log(message);
        router.push("/dashboard");
      } else {
        setError(res?.data?.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen w-full font-sans">
      <div className="flex flex-col md:items-start items-center justify-center gap-8 w-full md:w-2/3 md:px-20">
        <div className="flex items-center md:items-start flex-col">
          <h1 className="text-xl font-bold">Hey Admin,👋</h1>
          <p className="text-gray-800">Please enter your credentials</p>
        </div>
        <form className="max-w-[400px]" onSubmit={handleSubmit} method="POST">
          <div className="flex flex-col gap-4 mb-4">
            <Input
              type="text"
              placeholder="Username"
              className="w-full p-3 text-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              className="w-full p-3 text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm bg-red-300 px-2 py-3 rounded-xl mb-3">
              {error}
            </p>
          )}
          <div className="w-full md:w-[120px]">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !username || !password}
              className="w-full"
            >
              {isLoading ? (
                <>
                  Please Wait <Loader2 className="animate-spin" />
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </form>
      </div>
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
