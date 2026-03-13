import Image from "next/image";
import { Calculator, FileText } from "lucide-react";
import Link from "next/link";
import { ESTIMATION, INVOICE } from "@/constants/path";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6">
      {/* Logo + Title */}
      <div className="absolute top-10 flex flex-col items-center gap-3">
        <Image
          src="/logo.png" // place your logo in public folder
          alt="Raj Logo"
          width={600}
          height={600}
          className=" w-52 h-20"
        />

        <p className="text-gray-400 text-sm">Printing Management System</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Estimation */}
        <Link
          href={ESTIMATION}
          className="group w-80 h-36 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-row items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
        >
          <Calculator
            size={34}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="text-lg font-semibold">Estimation</span>
        </Link>

        {/* Invoice */}
        <Link
          href={INVOICE}
          className="group w-80 h-36 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex flex-row items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
        >
          <FileText
            size={34}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="text-lg font-semibold">Invoice</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
