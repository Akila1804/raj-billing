"use client";
import { DASHBOARD, TALLY_DETAILS } from "@/constants/path";
import {
  ArrowLeftFromLineIcon,
  BarChart3,
  Eye,
  Pencil,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { generateCustomerNumber } from "./generateCustomerNumber";

interface Member {
  customer_no: string;
  customer_name: string;
  phone: string;
  address: string;
  gst: string;
}

interface MembersInterface {
  members: Member[];
}

const TallyPage = ({ members }: MembersInterface) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [data, setData] = useState(members);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setloading] = useState(false);
  // Edit
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customer_no: "",
    customer_name: "",
    phone: "",
    address: "",
    gst: "",
  });
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const merged = (
        item.customer_no +
        item.address +
        item.phone +
        item.gst +
        (item.customer_name || "")
      ).toLowerCase();

      const matchesSearch = search
        ? merged.includes(search.toLowerCase())
        : true;

      return matchesSearch;
    });
  }, [search, data]);

  useEffect(() => {
    setData(members);
  }, [members]);

  useEffect(() => {
    const session = sessionStorage.getItem("adminToken");

    if (!session) {
      router.push("/");
    }
  }, []);

  const totalCount = filteredData.length;
  const paginatedProducts = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (item: Member) => {
    setIsEdit(true);
    setEditId(item.customer_no); // or use id if you have one

    setFormData({
      customer_no: item.customer_no,
      customer_name: item.customer_name,
      phone: item.phone,
      address: item.address,
      gst: item.gst,
    });

    setOpenModal(true);
  };

  const handleAddCustomer = async () => {
    setFormData({
      customer_no: "",
      customer_name: "",
      phone: "",
      address: "",
      gst: "",
    });
    setOpenModal(true);

    const nextEstNo = await generateCustomerNumber();
    setFormData((prev) => ({
      ...prev,
      customer_no: nextEstNo,
    }));
  };

  const handleSave = async () => {
    if (
      !formData.customer_name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      Swal.fire("Please fill all required fields (marked with *)");
      return;
    }
    setloading(true);
    try {
      const res = await fetch("/api/member", {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          customer_no: editId,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error);
      }

      Swal.fire(
        isEdit ? "Updated Successfully" : "Successfully Added",
        isEdit
          ? "Customer updated successfully!"
          : "Customer added successfully!",
        "success",
      );
      setFormData({
        customer_no: "",
        customer_name: "",
        phone: "",
        address: "",
        gst: "",
      });

      setIsEdit(false);
      setEditId(null);
      setOpenModal(false);
      setloading(false);
      router.refresh();
    } catch (error) {
      setloading(false);
      setOpenModal(false);
      Swal.fire("Error saving estimation");
    }
  };

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
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm font-medium">
                Total Customer
              </p>
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-blue-400">{totalCount}</p>
            <p className="text-xs text-slate-500 mt-2">All time estimations</p>
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
          </div>
        </div>
        <div className="bg-white  rounded-xl overflow-hidden shadow-sm">
          <div className="md:w-full w-screen overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">S.No</th>
                  <th className="p-3 text-left">Customer No</th>
                  <th className="p-3 text-left">Customer Name</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Address</th>
                  <th className="p-3 text-left">GST</th>
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
                  <tr
                    key={item.customer_no}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3">{index + 1}</td>

                    <td className="p-3 font-medium text-blue-600">
                      {item.customer_no}
                    </td>

                    <td className="p-3 text-gray-600">{item.customer_name}</td>
                    <td className="p-3 text-gray-600">{item.phone}</td>

                    <td className="p-3 font-semibold text-emerald-600">
                      {item.address}
                    </td>

                    <td className="p-3">{item.gst ? item.gst : "-"}</td>

                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          className="p-2 hover:bg-blue-100 rounded"
                          onClick={() =>
                            router.push(
                              `${TALLY_DETAILS}?id=${item.customer_no}`,
                            )
                          }
                          title="Preview"
                        >
                          <Eye size={16} className="text-blue-600" />
                        </button>

                        <button
                          className="p-2 hover:bg-green-100 rounded cursor-pointer"
                          onClick={() => handleEdit(item)}
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
              className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl "
              onClick={handleAddCustomer}
            >
              <Plus size={20} />
              Add Customer
            </button>
          </div>
        </div>
      </div>
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Add Customer
            </h2>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <label className="block text-sm font-semibold text-gray-700">
                  Customer No <span className="text-red-700 pb-2">*</span>
                </label>
                <input
                  readOnly
                  className="w-full px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl font-mono font-semibold text-lg cursor-not-allowed"
                  value={formData.customer_no}
                />
              </div>
              <div className="col-span-6">
                <label className="block text-sm font-semibold text-gray-700">
                  Customer Name <span className="text-red-700 pb-2">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none duration-200 shadow-sm"
                  placeholder="Enter customer name"
                  value={formData.customer_name}
                  required
                  name="customer_name"
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-6">
                <label className="block text-sm font-semibold text-gray-700">
                  Phone <span className="text-red-700 pb-2">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none duration-200 shadow-sm"
                  placeholder="Phone number"
                  value={formData.phone}
                  required
                  name="phone"
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-6">
                <label className="block text-sm font-semibold text-gray-700">
                  GSTIN (optional)
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none duration-200 shadow-sm"
                  placeholder="GSTIN"
                  value={formData.gst}
                  name="gst"
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-12">
                <label className="block text-sm font-semibold text-gray-700">
                  Address <span className="text-red-700 pb-2">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none duration-200 shadow-sm resize-vertical min-h-[100px]"
                  placeholder="Enter complete address"
                  value={formData.address}
                  required
                  name="address"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TallyPage;
