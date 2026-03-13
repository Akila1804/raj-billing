"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { DASHBOARD } from "@/constants/path";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (form.username === "rajprinters" && form.password === "raj@123") {
      sessionStorage.setItem("adminToken", "authenticated");
      router.push(DASHBOARD);
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-black bg-gradient-to-br from-gray-600 via-gray-800 to-gray-900 px-6 py-12">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative bg-white shadow-2xl rounded-3xl w-full max-w-md p-8 sm:p-10 transform transition-all duration-300 hover:shadow-3xl">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-500 rounded-full opacity-10 blur-2xl"></div>

        <div className="relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl mb-4 shadow-lg">
              <LogIn size={28} className="text-white" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in to continue to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1 group">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail
                  size={16}
                  className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
                />
                Username
              </label>
              <input
                name="username"
                required
                value={form.username}
                onChange={handleChange}
                placeholder="username"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
              />
            </div>

            {/* {mode !== 'reset' && ( */}
            <div className="space-y-1 group">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Lock
                  size={16}
                  className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
                />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="password"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <>
                    <LogIn size={20} />
                    Sign In
                  </>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
