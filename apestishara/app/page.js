"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen w-full font-[family-name:var(--font-geist-sans)]">
      {/* Left Section - Form */}
      <div className="flex flex-col md:items-start items-center justify-center gap-8 w-full md:w-2/3 md:px-20">
        <div className="flex items-center md:items-start flex-col">
          <h1 className="text-xl font-bold">Hey Admin,👋</h1>
          <p className="text-gray-800">Please enter your credentials</p>
        </div>
        <form className="w-[400px]" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 mb-4">
            <Input
              type="email"
              placeholder="Email"
              className="w-full p-3 text-lg"
            />
            <Input
              type="password"
              placeholder="Password"
              className="w-full p-3 text-lg"
            />
          </div>
          <div className="w-full md:w-[120px]">
            <Button type="submit" size="lg" disabled={isLoading ? true : false} className="w-full">
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

      {/* Right Section - Doctor Image (Hidden on Mobile) */}
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
