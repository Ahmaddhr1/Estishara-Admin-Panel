"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    console.log("Attempting to sign in with:", { email, password });

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("Sign-in response:", res);

      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Something went wrong, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen w-full font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col md:items-start items-center justify-center gap-8 w-full md:w-2/3 md:px-20">
        <div className="flex items-center md:items-start flex-col">
          <h1 className="text-xl font-bold">Hey Admin,👋</h1>
          <p className="text-gray-800">Please enter your credentials</p>
        </div>
        <form className="w-[400px]" onSubmit={handleSubmit} method="POST">
          <div className="flex flex-col gap-4 mb-4">
            <Input
              type="email"
              placeholder="Email"
              className="w-full p-3 text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              disabled={isLoading || !email || !password}
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