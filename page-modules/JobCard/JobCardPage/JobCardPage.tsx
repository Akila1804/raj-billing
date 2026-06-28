"use client";
import { useMemo, useState } from "react";
import {
  Plus,
  Eye,
  Pencil,
  BarChart3,
  ArrowLeftFromLineIcon,
} from "lucide-react";
import Image from "next/image";
import { ADD_JOB_CARD, DASHBOARD, UPDATE_ESTIMATION } from "@/constants/path";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toTitleCase } from "@/constants/function";
import { JobCard } from "@/types/jobCard";

const estimate: JobCard[] = [
  {
    id: "1",
    jobno: "JOB-001",
    job_name: "Job Name 1",
    description: "Job Description 1",
    offset_name: "Offset Name 1",
    paper: "Art Paper",
    paper_qty: "1000",
    paper_qty_unit: "Sheets",
    paper_printing_type: "Single Side",
    plate_com_name: "Plate Type A",
    plate_color: "5",
    plate_type: "Type A",
    lamination: true,
    lamination_type: "Glossy",
    lamination_com_name: "Company A",
    scoring: true,
    scoring_type: "Medium",
    scoring_com_name: "Company B",
    pasting: true,
    pasting_type: "High",
    pasting_com_name: "Company C",
    folding: true,
    folding_type: "Low",
    folding_com_name: "Company D",
    binding: true,
    binding_type: "Strong",
    binding_com_name: "Company E",
    cutting: true,
    cutting_type: "Precise",
    cutting_com_name: "Company F",
    extra_work: "Additional Work",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-02T12:00:00Z",
  },
  {
    id: "2",
    jobno: "JOB-002",
    job_name: "Job Name 2",
    description: "Job Description 2",
    offset_name: "Offset Name 2",
    paper: "Art Paper",
    paper_qty: "1000",
    paper_qty_unit: "Sheets",
    paper_printing_type: "Single Side",
    plate_com_name: "Plate Type A",
    plate_type: "Type A",
    plate_color: "5",
    lamination: false,
    lamination_type: "",
    lamination_com_name: "",
    scoring: true,
    scoring_type: "Medium",
    scoring_com_name: "Company B",
    pasting: true,
    pasting_type: "High",
    pasting_com_name: "Company C",
    folding: false,
    folding_type: "",
    folding_com_name: "",
    binding: true,
    binding_type: "Strong",
    binding_com_name: "Company E",
    cutting: false,
    cutting_type: "",
    cutting_com_name: "",
    extra_work: "Additional Work",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-02T12:00:00Z",
  },
];

export default function JobCardPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  //   const [year, setYear] = useState("");
  //   const [month, setMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  //   const [fromDate, setFromDate] = useState("");
  //   const [toDate, setToDate] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobCard | null>(null);
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return estimate.filter((item) => {
      const merged = [
        item.jobno,
        item.job_name,
        item.description,
        item.offset_name,
        item.paper,
        item.paper_qty,
        item.paper_qty_unit,
        item.paper_printing_type,
        item.plate_com_name,
        item.plate_color,
        item.lamination_com_name,
        item.scoring,
        item.scoring_com_name,
        item.pasting,
        item.pasting_com_name,
        item.folding,
        item.folding_com_name,
        item.binding,
        item.binding_com_name,
        item.cutting,
        item.cutting_com_name,
        item.extra_work,
      ]
        .join(" ")
        .toLowerCase();

      return search ? merged.includes(search.toLowerCase()) : true;
    });
  }, [search]);

  const totalCount = filteredData.length;

  const paginatedProducts = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleAddJobCard = () => {
    router.push(ADD_JOB_CARD);
  };

  const renderDetailRow = (
    label: string,
    enabled: boolean,
    typeValue?: string,
    companyName?: string,
  ) => (
    <div
      className={`rounded-xl border p-4 ${
        enabled
          ? "border-emerald-200 bg-emerald-50/70"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-semibold text-gray-800">{label}</h4>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            enabled
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {enabled ? "Included" : "Not required"}
        </span>
      </div>

      {enabled ? (
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500">Type</span>
            <span className="font-medium text-gray-700">
              {typeValue || "Not specified"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500">Company</span>
            <span className="font-medium text-gray-700">
              {companyName || "Not specified"}
            </span>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-gray-500">
          No finishing work requested for this item.
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className=" px-6 py-2 flex justify-between">
          <Link href={DASHBOARD}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={600}
              height={600}
              className=" w-52 h-20"
            />
          </Link>
          <div className="flex items-center">
            <Link
              href={DASHBOARD}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-md transition w-fit"
            >
              <ArrowLeftFromLineIcon size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm font-medium">
                Total Estimations
              </p>
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{totalCount}</p>
            <p className="text-xs text-slate-500 mt-2">All time estimations</p>
          </div>

          {/* <div className="bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm font-medium">Total Amount</p>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-emerald-400">
              ₹{totalAmount.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-2">Project value</p>
          </div>

          <div className="bg-linear-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm font-medium">This Month</p>
              <div className="w-5 h-5 rounded-full bg-yellow-500/30"></div>
            </div>
            <p className="text-3xl font-bold text-orange-400">
              {thisMonthCount}
            </p>
          </div> */}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end justify-center">
            {/* 🔍 Search */}
            <div className="col-span-3">
              <label className="text-xs text-gray-500">Search</label>
              <input
                type="text"
                placeholder="No / Name / Location / Date..."
                className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2 text-sm outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* 📅 Year */}
            {/* <div className="col-span-1">
              <label className="text-xs text-gray-500">Year</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">All</option>
                <option>2026</option>
                <option>2025</option>
              </select>
            </div> */}

            {/* 📆 Month */}
            {/* <div className="col-span-2">
              <label className="text-xs text-gray-500">Month</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">All</option>
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
            </div> */}

            {/* 📅 Date Range */}
            {/* <div className="flex gap-2 col-span-5">
              <div className="w-full">
                <label className="text-xs text-gray-500">From</label>
                <input
                  type="date"
                  max={today}
                  className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm"
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="w-full">
                <label className="text-xs text-gray-500">To</label>
                <input
                  type="date"
                  max={today}
                  className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm"
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div> */}
            {search !== "" ? (
              <div className="col-span-1 h-full flex items-end">
                <button
                  onClick={() => {
                    setSearch("");
                    // setYear("");
                    // setMonth("");
                    // setFromDate("");
                    // setToDate("");
                  }}
                  className="text-sm text-red-500 mt-1 "
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white  rounded-xl overflow-hidden shadow-sm">
          <div className="md:w-full w-screen overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">S.No</th>
                  <th className="p-3 text-left">Job No</th>
                  <th className="p-3 text-left">Job Name</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Offset Name</th>
                  <th className="p-3 text-left">Paper</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan={15}
                      className="px-6 py-8 text-center text-slate-400"
                    >
                      <p className="text-sm">
                        No job cards found matching your filters
                      </p>
                    </td>
                  </tr>
                )}
                {paginatedProducts.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50 align-top"
                  >
                    <td className="p-3">{index + 1}</td>

                    <td className="p-3 font-medium text-blue-600">
                      {item.jobno}
                    </td>

                    <td className="p-3 text-gray-600 capitalize">
                      {toTitleCase(item.job_name)}
                    </td>

                    <td className="p-3 text-gray-600">{item.description}</td>

                    <td className="p-3 text-gray-600">{item.offset_name}</td>

                    <td className="p-3 text-gray-600">
                      {item.paper} ({item.paper_qty} {item.paper_qty_unit})
                    </td>

                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          className="p-2 hover:bg-blue-100 rounded"
                          onClick={() => setSelectedJob(item)}
                          title="View"
                        >
                          <Eye size={16} className="text-blue-600" />
                        </button>

                        <button
                          className="p-2 hover:bg-green-100 rounded cursor-pointer"
                          onClick={() =>
                            router.push(`${UPDATE_ESTIMATION}?id=${item.jobno}`)
                          }
                          title="Edit"
                        >
                          <Pencil size={16} className="text-green-600" />
                        </button>
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
              className="flex items-center gap-2 cursor-pointer bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition  "
              onClick={handleAddJobCard}
            >
              <Plus size={20} />
              Add Job Card
            </button>
          </div>
        </div>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
              <div>
                <p className="text-sm text-blue-100">{selectedJob.jobno}</p>
                <h2 className="text-2xl font-bold">
                  {toTitleCase(selectedJob.job_name)}
                </h2>
                <p className="mt-1 text-sm text-blue-100">
                  {selectedJob.description}
                </p>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="rounded-lg bg-white/20 px-3 py-2 text-sm hover:bg-white/30 transition"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-8">
              {/* Job Information */}
              <div>
                <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">
                  Job Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs uppercase text-gray-400">Job No</p>
                    <p className="font-medium">{selectedJob.jobno}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-400">Job Name</p>
                    <p className="font-medium">
                      {toTitleCase(selectedJob.job_name)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-400">
                      Description
                    </p>
                    <p>{selectedJob.description}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-400">Offset</p>
                    <p>{selectedJob.offset_name}</p>
                  </div>
                </div>
              </div>

              {/* Printing Details */}
              <div>
                <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">
                  Printing Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs uppercase text-gray-400">Paper</p>
                    <p>
                      {selectedJob.paper} ({selectedJob.paper_qty}{" "}
                      {selectedJob.paper_qty_unit})
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-400">Plate</p>
                    <p>
                      {selectedJob.plate_com_name || "Not Available"} -{" "}
                      {selectedJob.plate_type || "Not Available"} (
                      {selectedJob.plate_color || "-"} Colors)
                    </p>
                  </div>
                </div>
              </div>

              {/* Finishing Works */}
              <div>
                <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">
                  Finishing Works
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {renderDetailRow(
                    "Lamination",
                    selectedJob.lamination,
                    selectedJob.lamination_type,
                    selectedJob.lamination_com_name,
                  )}

                  {renderDetailRow(
                    "Scoring",
                    selectedJob.scoring,
                    selectedJob.scoring_type,
                    selectedJob.scoring_com_name,
                  )}

                  {renderDetailRow(
                    "Pasting",
                    selectedJob.pasting,
                    selectedJob.pasting_type,
                    selectedJob.pasting_com_name,
                  )}

                  {renderDetailRow(
                    "Folding",
                    selectedJob.folding,
                    selectedJob.folding_type,
                    selectedJob.folding_com_name,
                  )}

                  {renderDetailRow(
                    "Binding",
                    selectedJob.binding,
                    selectedJob.binding_type,
                    selectedJob.binding_com_name,
                  )}

                  {renderDetailRow(
                    "Cutting",
                    selectedJob.cutting,
                    selectedJob.cutting_type,
                    selectedJob.cutting_com_name,
                  )}
                </div>
              </div>

              {/* Extra Work */}
              <div>
                <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">
                  Additional Work
                </h3>

                <div className="rounded-xl border bg-gray-50 p-4">
                  {selectedJob.extra_work || "No additional work"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
