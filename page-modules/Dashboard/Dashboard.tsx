"use client";
import Image from "next/image";
import { Calculator, FileText, LogOut } from "lucide-react";
import Link from "next/link";
import { ESTIMATION, INVOICE, TALLY } from "@/constants/path";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const Dashboard = () => {
  const router = useRouter();

  // 🔐 Protect Route
  useEffect(() => {
    const session = sessionStorage.getItem("adminToken");

    if (!session) {
      router.replace("/");
    }
  }, [router]);

  // 🚪 Logout Function
  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "You will be logged out of the system",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      confirmButtonColor: "#ef4444",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("adminToken");
        router.replace("/");
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 relative">
      {/* 🔴 Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-md transition"
      >
        <LogOut size={16} />
        Logout
      </button>

      {/* 🏷 Logo + Title */}
      <div className="absolute top-10 flex flex-col items-center gap-3">
        <Image
          src="/logo.png"
          alt="Raj Logo"
          width={200}
          height={80}
          className="object-contain"
        />
        <p className="text-gray-400 text-sm">Printing Management System</p>
      </div>

      {/* 📦 Main Buttons */}
      <div className="flex flex-col sm:flex-row gap-8 mt-20">
        {/* Estimation */}
        <Link
          href={ESTIMATION}
          className="group w-80 h-36 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition duration-300 hover:-translate-y-2"
        >
          <Calculator size={34} className="group-hover:scale-110 transition" />
          <span className="text-lg font-semibold">Estimation</span>
        </Link>

        {/* Invoice */}
        <Link
          href={INVOICE}
          className="group w-80 h-36 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition duration-300 hover:-translate-y-2"
        >
          <FileText size={34} className="group-hover:scale-110 transition" />
          <span className="text-lg font-semibold">Invoice</span>
        </Link>
      </div>

      {/* 📊 Tally */}
      <div className="mt-10">
        <Link
          href={TALLY}
          className="group w-96 h-36 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition duration-300 hover:-translate-y-2"
        >
          <FileText size={34} className="group-hover:scale-110 transition" />
          <span className="text-lg font-semibold">Tally</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
