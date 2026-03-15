"use client";
import { useEffect, useMemo, useState } from "react";
import { Plus, Eye, Pencil, BarChart3, TrendingUp } from "lucide-react";
import Image from "next/image";
import {
  ADD_ESTIMATION,
  DASHBOARD,
  PREVIEW_ESTIMATION,
  UPDATE_ESTIMATION,
} from "@/constants/path";
import { useRouter } from "next/navigation";
import { Estimate } from "@/types/estimate";
import Link from "next/link";

interface EstimationInterface {
  estimate: Estimate[];
}

export default function EstimationPage({ estimate }: EstimationInterface) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return estimate.filter((item) => {
      const itemDate = new Date(item.date);
      const itemYear = String(itemDate.getFullYear());
      const itemMonth = itemDate.toLocaleString("en-US", { month: "long" });

      const matchesYear = year ? itemYear === year : true;
      const matchesMonth = month ? itemMonth === month : true;

      const merged = (
        item.estimationNo +
        item.city +
        (item.customerName || "")
      ).toLowerCase();

      const matchesSearch = search
        ? merged.includes(search.toLowerCase())
        : true;

      return matchesYear && matchesMonth && matchesSearch;
    });
  }, [search, year, month, estimate]);

  useEffect(() => {
    const session = sessionStorage.getItem("adminToken");

    if (!session) {
      router.push("/");
    }
  }, []);

  const totalCount = estimate.length;
  const totalAmount = estimate.reduce((sum, item) => sum + item.grandTotal, 0);
  const thisMonthCount = estimate.filter((d) => {
    const now = new Date();
    const dDate = new Date(d.date);
    return (
      dDate.getFullYear() === now.getFullYear() &&
      dDate.getMonth() === now.getMonth()
    );
  }).length;

  const paginatedProducts = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleAddEstimation = () => {
    router.push(ADD_ESTIMATION);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className=" px-6 py-2">
          <Link href={DASHBOARD}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={600}
              height={600}
              className=" w-52 h-20"
            />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm font-medium">
                Total Estimations
              </p>
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{totalCount}</p>
            <p className="text-xs text-slate-500 mt-2">All time estimations</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm font-medium">Total Amount</p>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-emerald-400">
              ₹{(totalAmount / 100000).toFixed(1)}L
            </p>
            <p className="text-xs text-slate-500 mt-2">Project value</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm font-medium">This Month</p>
              <div className="w-5 h-5 rounded-full bg-yellow-500/30"></div>
            </div>
            <p className="text-3xl font-bold text-orange-400">
              {thisMonthCount}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white  rounded-xl p-6 mb-6 shadow-sm">
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search (No / Name / Location / Date)..."
              className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2 text-sm outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">All Years</option>
              <option>2026</option>
              <option>2025</option>
            </select>
            <div>
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm h-14 w-full"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">All Months</option>
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white  rounded-xl overflow-hidden shadow-sm">
          <div className="md:w-full w-screen overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">S.No</th>
                  <th className="p-3 text-left">Estimation No</th>

                  <th className="p-3 text-left">Client</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-6 py-8 text-center text-slate-400"
                    >
                      <p className="text-sm">
                        No estimations found matching your filters
                      </p>
                    </td>
                  </tr>
                )}
                {paginatedProducts.map((item, index) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>

                    <td className="p-3 font-medium text-blue-600">
                      {item.estimationNo}
                    </td>

                    <td className="p-3 text-gray-600">{item.customerName}</td>

                    <td className="p-3 font-semibold text-emerald-600">
                      ₹{item.grandTotal.toLocaleString()}
                    </td>

                    <td className="p-3">{item.city}</td>

                    <td className="p-3 text-gray-500">
                      {new Date(item.date).toLocaleDateString("en-IN")}
                    </td>

                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          className="p-2 hover:bg-blue-100 rounded"
                          onClick={() =>
                            router.push(
                              `${PREVIEW_ESTIMATION}?id=${item.estimationNo}`,
                            )
                          }
                          title="Preview"
                        >
                          <Eye size={16} className="text-blue-600" />
                        </button>

                        <button
                          className="p-2 hover:bg-green-100 rounded cursor-pointer"
                          onClick={() =>
                            router.push(
                              `${UPDATE_ESTIMATION}?id=${item.estimationNo}`,
                            )
                          }
                          title="Edit"
                        >
                          <Pencil size={16} className="text-green-600" />
                        </button>

                        {/* <button className="p-2 hover:bg-red-100 rounded">
                        <Trash2 size={16} className="text-red-600" />
                      </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-6 text-black">
            <div className="text-sm text-gray-800">
              Showing{" "}
              <span className="text-slate-800 font-semibold">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="text-slate-800 font-semibold">
                {Math.min(currentPage * itemsPerPage, filteredData.length)}
              </span>{" "}
              of{" "}
              <span className="text-slate-800 font-semibold">
                {filteredData.length}
              </span>{" "}
              estimations
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-slate-300 rounded-lg transition text-sm font-medium"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                <span className="text-gray-800 text-sm">
                  Page <span className="font-semibold">{currentPage}</span> of{" "}
                  <span className="font-semibold">
                    {Math.max(1, Math.ceil(filteredData.length / itemsPerPage))}
                  </span>
                </span>
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      Math.ceil(filteredData.length / itemsPerPage),
                    ),
                  )
                }
                disabled={
                  currentPage >= Math.ceil(filteredData.length / itemsPerPage)
                }
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-slate-300 rounded-lg transition text-sm font-medium"
              >
                Next
              </button>
            </div>
          </div>

          <div className="fixed bottom-8 right-8 z-10">
            <button
              className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
              onClick={handleAddEstimation}
            >
              <Plus size={20} />
              Add Estimation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
