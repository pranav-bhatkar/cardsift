"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle, XCircle, Loader } from "lucide-react";
import { Button } from "@cc/components/ui/button";
import { Input } from "@cc/components/ui/input";
import Link from "next/link";
import { authClient } from "@cc/lib/auth-client";
import { cn } from "@cc/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // const success = await login(email, password)
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (data) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      if (error) {
        console.error("Login error:", error);
        setError(error.message || "Login failed");
      } else {
        setError("Invalid email or password");
      }
    }
    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-green-600"
          >
            Login Successful!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground"
          >
            Redirecting...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg border p-8 shadow-lg"
        >
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="focus:ring-primary/20 transition-all duration-200 focus:ring-2"
                />
              </motion.div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>
              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="focus:ring-primary/20 pr-10 transition-all duration-200 focus:ring-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </motion.div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  backgroundColor: [
                    "rgba(239, 68, 68, 0.1)",
                    "rgba(239, 68, 68, 0.05)",
                  ],
                }}
                transition={{
                  x: { type: "spring", stiffness: 300 },
                  backgroundColor: { duration: 0.5 },
                }}
                className="flex items-center space-x-2 rounded-lg border border-red-200 p-3 text-sm text-red-600"
              >
                <XCircle className="h-4 w-4" />
                <span>{error}</span>
              </motion.div>
            )}

            <div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full overflow-hidden"
                >
                  {isLoading && (
                    <Loader className={cn("mr-2 h-4 w-4 animate-spin")} />
                  )}
                  {isLoading ? <>Signing in...</> : <>Sign In</>}
                </Button>
              </motion.div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
            <div className="bg-muted/50 mt-4 rounded-lg p-3">
              <p className="text-muted-foreground text-xs">Demo credentials:</p>
              <p className="font-mono text-xs">demo@example.com / password</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
