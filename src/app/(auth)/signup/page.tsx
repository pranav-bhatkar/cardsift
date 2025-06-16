"use client";

import React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  User,
  Briefcase,
  CreditCard,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cc/components/ui/select";
import { Button } from "@cc/components/ui/button";
import { Input } from "@cc/components/ui/input";
import { authClient } from "@cc/lib/auth-client";
import { signupAction } from "./action";

const steps = [
  {
    id: 1,
    title: "Personal Information",
    icon: User,
    fields: ["name", "email", "password"],
  },
  {
    id: 2,
    title: "Employment Details",
    icon: Briefcase,
    fields: ["employment", "income"],
  },
  {
    id: 3,
    title: "Credit Profile",
    icon: CreditCard,
    fields: ["creditScore", "age"],
  },
];

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    employment: "",
    income: "",
    creditScore: "",
    age: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (stepIndex: number) => {
    const stepFields = steps[stepIndex].fields;
    const stepErrors: Record<string, string> = {};

    stepFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        stepErrors[field] = "This field is required";
      }
    });

    if (stepIndex === 0 && formData.email && !formData.email.includes("@")) {
      stepErrors.email = "Please enter a valid email";
    }

    if (stepIndex === 0 && formData.password && formData.password.length < 6) {
      stepErrors.password = "Password must be at least 6 characters";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      try {
        setIsLoading(true);
        const { data, error } = await authClient.signUp.email(
          {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            callbackURL: "/dashboard",
          },
          {
            onRequest: () => {
              // Already handling loading state
            },
            onSuccess: () => {
              setIsSuccess(true);
              setTimeout(() => {
                router.push("/");
              }, 2000);
            },
            onError: (ctx) => {
              setErrors((prev) => ({ ...prev, form: ctx.error.message }));
            },
          },
        );
        if (data) {
          await signupAction({
            userId: data.user.id,
            age: parseInt(formData.age, 10),
            creditScore: parseInt(formData.creditScore, 10),
            employment: formData.employment as any, // Adjust type as needed
            income: parseFloat(formData.income),
            existingRelationship: [], // Add logic to handle existing relationships if needed
          });
          setIsSuccess(true);
        }

        if (error) throw error;

        // Store additional user data if needed
        // You might need to create a separate API call to store employment, income, etc.
      } catch (err) {
        console.error("Signup error:", err);
      } finally {
        setIsLoading(false);
      }
    }
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
            animate={{ scale: 1, rotate: [0, 360] }}
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
            Account Created Successfully!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground"
          >
            Welcome to CardSift AI
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="w-full max-w-md"
      >
        {/* Progress Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.3,
            ease: "easeInOut",
            stiffness: 100,
            damping: 20,
          }}
          className="mb-8"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-muted-foreground text-sm">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="bg-muted h-2 w-full rounded-full">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg border p-8 shadow-lg"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="mb-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                >
                  {React.createElement(steps[currentStep].icon, {
                    className: "h-6 w-6 text-primary",
                  })}
                </motion.div>
                <h2 className="text-2xl font-bold">
                  {steps[currentStep].title}
                </h2>
              </div>

              <div className="space-y-6">
                {steps[currentStep].fields.map((field, index) => (
                  <div key={field}>
                    <label className="mb-2 block text-sm font-medium capitalize">
                      {field === "creditScore" ? "Credit Score" : field}
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {field === "employment" ? (
                        <Select
                          defaultValue={formData.employment}
                          onValueChange={(value) =>
                            handleInputChange("employment", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Employment Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Salaried">Salaried</SelectItem>
                            <SelectItem value="Self_Employed">
                              Self Employed
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={
                            field === "password"
                              ? "password"
                              : field === "email"
                                ? "email"
                                : ["income", "creditScore", "age"].includes(
                                      field,
                                    )
                                  ? "number"
                                  : "text"
                          }
                          value={formData[field as keyof typeof formData]}
                          onChange={(e) =>
                            handleInputChange(field, e.target.value)
                          }
                          placeholder={getPlaceholder(field)}
                          className={`transition-all duration-200 ${
                            errors[field]
                              ? "border-red-500 focus:ring-red-200"
                              : "focus:ring-primary/20"
                          }`}
                        />
                      )}
                    </motion.div>
                    {errors[field] && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          x: [-2, 2, -2, 2, 0],
                        }}
                        transition={{
                          y: { duration: 0.2 },
                          x: { duration: 0.4 },
                        }}
                        className="mt-1 text-sm text-red-500"
                      >
                        {errors[field]}
                      </motion.p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>

            {currentStep === steps.length - 1 ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button onClick={handleNext} className="flex items-center">
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function getPlaceholder(field: string): string {
  const placeholders: Record<string, string> = {
    name: "Enter your full name",
    email: "Enter your email address",
    password: "Create a password",
    employment: "e.g., Software Engineer",
    income: "Annual income in ₹",
    creditScore: "e.g., 750",
    age: "Your age",
  };
  return placeholders[field] || "";
}
