/* eslint-disable react-hooks/purity */
"use client";

import { useState, useEffect } from "react";
import { ArrowLeftIcon, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";
import { generateEstimationNumber } from "./generateEstimateNo";
import { useRouter } from "next/navigation";
import { ESTIMATION } from "@/constants/path";
import Link from "next/link";

export default function AddEstimation() {
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const [products, setProducts] = useState([
    { id: Date.now(), name: "", qty: 0, rate: 0, amount: 0 },
  ]);

  const [form, setForm] = useState({
    customerName: "",
    address: "",
    gst: "",
    phone: "",
    estimationNo: "",
    city: "",
    date: new Date().toISOString().split("T")[0],
    packing: 0,
    cgst: 9,
    sgst: 9,
  });

  // Generate unique estimation number
  useEffect(() => {
    const loadNumber = async () => {
      const nextEstNo = await generateEstimationNumber();
      console.log("nextEstNo", nextEstNo);
      setForm((prev) => ({
        ...prev,
        estimationNo: nextEstNo,
      }));
    };

    loadNumber();
  }, []);

  useEffect(() => {
    const session = sessionStorage.getItem("adminToken");

    if (!session) {
      router.push("/");
    }
  }, []);

  const handleProductChange = (
    index: number,
    field: string,
    value: unknown,
  ) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    updated[index].amount = updated[index].qty * updated[index].rate;
    setProducts(updated);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { id: Date.now(), name: "", qty: 0, rate: 0, amount: 0 },
    ]);
  };

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      const updated = [...products];
      updated.splice(index, 1);
      setProducts(updated);
    }
  };

  const subTotal = products.reduce((sum, p) => sum + p.amount, 0);

  const taxableAmount = subTotal + Number(form.packing);

  const cgstAmount = (taxableAmount * form.cgst) / 100;
  const sgstAmount = (taxableAmount * form.sgst) / 100;

  const grandTotal = taxableAmount + cgstAmount + sgstAmount;

  const handleSave = async () => {
    if (
      !form.customerName.trim() ||
      !form.phone.trim() ||
      !form.city.trim() ||
      !form.address.trim()
    ) {
      Swal.fire("Please fill all required fields (marked with *)");
      return;
    }

    // Product validation
    const invalidProduct = products.find(
      (p) => !p.name.trim() || p.qty <= 0 || p.rate <= 0,
    );

    if (invalidProduct) {
      Swal.fire("Each product must have Name, Quantity and Rate");
      return;
    }

    if (products.length === 0) {
      Swal.fire("Add at least one product");
      return;
    }
    console.log("Saving estimation:", {
      form,
      products,
      totals: { subTotal, cgstAmount, sgstAmount, grandTotal },
    });
    setloading(true);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form,
          products,
          totals: { subTotal, cgstAmount, sgstAmount, grandTotal },
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error);
      }

      Swal.fire(
        "Successfully Added",
        "Estimate added successfully! You can now view it in the products list.",
        "success",
      );
      router.push(ESTIMATION);
    } catch (error) {
      setloading(false);
      Swal.fire("Error saving estimation");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className=" px-6 py-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={600}
            height={600}
            className=" w-52 h-20"
          />
        </div>
      </div>
      <div className="bg-white pl-10 pt-5">
        <Link
          href={ESTIMATION}
          className="text-red-700 flex gap-3 items-center"
        >
          <ArrowLeftIcon /> Go Back
        </Link>
      </div>
      <div className="max-w-7xl mx-auto p-8 pt-0">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/50">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-8">
            New Estimation
          </h1>
          <div className="space-y-4 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700">
              Estimation No.
            </label>
            <input
              readOnly
              className="w-full px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl font-mono font-semibold text-lg cursor-not-allowed"
              value={form.estimationNo}
            />
          </div>
          {/* Customer Details Card */}
          <div className="grid md:grid-cols-3 gap-6 my-10 p-8  rounded-2xl border border-indigo-100">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Customer Name <span className="text-red-700 pb-2">*</span>
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none duration-200 shadow-sm"
                placeholder="Enter customer name"
                value={form.customerName}
                required
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Phone <span className="text-red-700 pb-2">*</span>
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none duration-200 shadow-sm"
                placeholder="Phone number"
                value={form.phone}
                required
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                GSTIN (optional)
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none duration-200 shadow-sm"
                placeholder="GSTIN"
                value={form.gst}
                onChange={(e) => setForm({ ...form, gst: e.target.value })}
              />
            </div>

            <div className="space-y-4 ">
              <label className="block text-sm font-semibold text-gray-700">
                City <span className="text-red-700 pb-2">*</span>
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none duration-200 shadow-sm"
                placeholder="Enter City"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Date <span className="text-red-700 pb-2">*</span>
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none duration-200 shadow-sm"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Address <span className="text-red-700 pb-2">*</span>
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none duration-200 shadow-sm resize-vertical min-h-[100px]"
                placeholder="Enter complete address"
                value={form.address}
                required
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="rounded-2xl border border-blue-100 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/50 backdrop-blur-sm">
                    <th className="p-4 text-left font-semibold text-gray-700 border-b border-gray-200">
                      S.No
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700 border-b border-gray-200">
                      Description
                    </th>
                    <th className="p-4 text-right font-semibold text-gray-700 border-b border-gray-200">
                      Qty
                    </th>
                    <th className="p-4 text-right font-semibold text-gray-700 border-b border-gray-200">
                      Rate
                    </th>
                    <th className="p-4 text-right font-semibold text-gray-700 border-b border-gray-200">
                      Amount
                    </th>
                    {products.length > 1 && (
                      <th className="p-4 text-center font-semibold text-gray-700 border-b border-gray-200 w-16">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr
                      key={product.id}
                      className="hover:bg-white/60 transition-colors"
                    >
                      <td className="p-4 font-mono text-sm font-semibold">
                        {index + 1}
                      </td>
                      <td className="p-4">
                        <textarea
                          className="w-full h-15 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none"
                          placeholder="Product/Service description"
                          value={product.name}
                          onChange={(e) =>
                            handleProductChange(index, "name", e.target.value)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-full h-15 px-2 py-2 text-right border border-gray-200 rounded-lg focus:outline-none"
                          value={product.qty}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "qty",
                              Number(e.target.value) || 0,
                            )
                          }
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-full h-15 px-2 py-2 text-right border border-gray-200 rounded-lg focus:outline-none"
                          value={product.rate}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "rate",
                              Number(e.target.value) || 0,
                            )
                          }
                        />
                      </td>
                      <td className="p-4 font-mono font-semibold text-right text-lg text-gray-900">
                        ₹
                        {product.amount.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="p-4">
                        {products.length > 1 && (
                          <button
                            onClick={() => removeProduct(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={addProduct}
              className="mt-6 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus size={20} />
              Add Item
            </button>
          </div>

          {/* Totals Card */}
          <div className="max-w-md ml-auto p-8 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 shadow-lg">
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span>Sub Total</span>
                <span>₹{subTotal.toFixed(2)}</span>
              </div>

              {/* Packing */}
              {/* <div className=" items-center gap-3">
                <span>Packing & Forwarding</span>

                <input
                  type="number"
                  className="w-14 border rounded-lg px-2 py-1 text-right"
                  value={form.packing}
                  onChange={(e) =>
                    setForm({ ...form, packing: Number(e.target.value) || 0 })
                  }
                />
              </div> */}

              <div className="flex justify-between text-center border-b pb-2">
                <div className="flex gap-2 justify-center items-center">
                  <p className="flex flex-col items-start gap-1">
                    <span>Packing & Forwarding</span>
                    Taxable Amount{" "}
                  </p>
                  <input
                    type="number"
                    className="w-14 border rounded-lg px-2 py-1 text-right"
                    value={form.packing}
                    onChange={(e) =>
                      setForm({ ...form, packing: Number(e.target.value) || 0 })
                    }
                  />
                </div>

                <span className="flex items-center">
                  ₹{taxableAmount.toFixed(2)}
                </span>
              </div>

              {/* CGST */}
              <div className="flex justify-between items-center gap-2">
                <div className="flex justify-between items-center gap-2">
                  <span>CGST</span>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="w-14 border rounded-lg px-1 py-1 text-right"
                      value={form.cgst}
                      onChange={(e) =>
                        setForm({ ...form, cgst: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <span className="w-24 text-right">
                  ₹{cgstAmount.toFixed(2)}
                </span>
              </div>

              {/* SGST */}
              <div className="flex justify-between items-center gap-2">
                <div className="flex justify-between items-center gap-2">
                  <span>SGST</span>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="w-14 border rounded-lg px-1 py-1 text-right"
                      value={form.sgst}
                      onChange={(e) =>
                        setForm({ ...form, sgst: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <span className="w-24 text-right">
                  ₹{sgstAmount.toFixed(2)}
                </span>
              </div>

              <div className="pt-4 border-t text-lg font-bold flex justify-between">
                <span>Grand Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-12 text-center">
            <button
              disabled={loading}
              onClick={handleSave}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
            >
              {loading ? "Saving..." : "💾 Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
