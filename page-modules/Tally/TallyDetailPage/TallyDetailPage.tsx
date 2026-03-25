"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";
import { generateVocherNumber } from "./generateVoucherNo";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { TALLY } from "@/constants/path";
import { Entry, Member } from "@/types/tally";

export default function LedgerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setloading] = useState(false);
  // 🔍 Filters
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [form, setForm] = useState<Entry>({
    voucher_id: "",
    date: "",
    product: "",
    description: "",
    debit: 0,
    credit: 0,
    customer_no: "",
  });
  const [formData, setFormData] = useState<Member>({
    customer_no: "",
    customer_name: "",
    phone: "",
    address: "",
    gst: "",
  });
  const today = new Date().toISOString().split("T")[0];

  // Generate unique estimation number

  const loadNumber = async () => {
    const nextEstNo = await generateVocherNumber();
    setForm((prev) => ({
      ...prev,
      voucher_id: nextEstNo,
    }));
  };

  useEffect(() => {
    if (id) {
      const fetchMemberData = async () => {
        try {
          const response = await axios.get("/api/member", {
            params: { id },
          });
          const member = response.data;

          setFormData({
            customer_no: member.customer_no,
            customer_name: member.customer_name,
            phone: member.phone,
            address: member.address,
            gst: member.gst,
          });
          const responseData = await axios.get("/api/voucher", {
            params: { customer_no: id },
          });
          const voucher = responseData.data;
          setEntries(voucher);
        } catch (error) {
          console.error("Error fetching Members data:", error);
        }
      };

      fetchMemberData();
    }
  }, [id]);

  // Add / Update
  const handleSubmit = async () => {
    if (!form.date || !form.product) {
      Swal.fire("Please fill all required fields (marked with *)");
      return;
    }

    try {
      setloading(true);
      if (isEditing) {
        // UPDATE
        const { error } = await supabase
          .from("voucher")
          .update({
            date: form.date,
            product: form.product,
            description: form.description,
            debit: form.debit,
            credit: form.credit,
          })
          .eq("voucher_id", form.voucher_id);

        if (error) throw error;

        // update local state
        setEntries((prev) =>
          prev.map((item) =>
            item.voucher_id === form.voucher_id ? form : item,
          ),
        );

        Swal.fire(
          "Updated Successfully",
          "Entry updated successfully!",
          "success",
        );
        setloading(false);
      } else {
        // ➕ INSERT
        const { data, error } = await supabase
          .from("voucher")
          .insert([
            {
              voucher_id: form.voucher_id,
              customer_no: formData.customer_no,
              date: form.date,
              product: form.product,
              description: form.description,
              debit: form.debit,
              credit: form.credit,
            },
          ])
          .select();

        if (error) throw error;

        // add to UI
        if (data) {
          setEntries((prev) => [...prev, data[0]]);
        }

        Swal.fire("Successfully Added", "Entry added successfully!", "success");
        setloading(false);
      }

      resetForm();
      setloading(false);
      setShowModal(false);
      setIsEditing(false);
    } catch (err: unknown) {
      console.error(err);
      setloading(false);
      Swal.fire("Error saving estimation");
    }
  };

  const resetForm = () => {
    setForm({
      voucher_id: "",
      date: "",
      product: "",
      description: "",
      debit: 0,
      credit: 0,
      customer_no: "",
    });
  };

  const handleEdit = (item: Entry) => {
    setForm(item);
    setIsEditing(true);
    setShowModal(true);
  };

  // 🔍 FILTER LOGIC
  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      const d = new Date(item.date);

      if (year && d.getFullYear() !== Number(year)) return false;
      if (month && d.getMonth() + 1 !== Number(month)) return false;

      if (fromDate && new Date(item.date) < new Date(fromDate)) return false;
      if (toDate && new Date(item.date) > new Date(toDate)) return false;

      return true;
    });
  }, [entries, year, month, fromDate, toDate]);

  // 📊 Running Balance
  const processedData = filteredEntries.map((item) => ({
    ...item,
    balance: item.debit - item.credit,
  }));

  // 🔢 Totals
  const totalDebit = filteredEntries.reduce((sum, i) => sum + i.debit, 0);
  const totalCredit = filteredEntries.reduce((sum, i) => sum + i.credit, 0);
  const difference = Math.abs(totalDebit - totalCredit);

  const finalDebit =
    totalDebit > totalCredit ? totalDebit : totalDebit + difference;
  const finalCredit =
    totalCredit > totalDebit ? totalCredit : totalCredit + difference;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm flex justify-between items-center px-6 py-2">
        <Image src="/logo.png" alt="Logo" width={200} height={60} />
      </div>
      <div className=" pl-10 pt-5">
        <Link href={TALLY} className="text-red-700 flex gap-3 items-center">
          <ArrowLeftIcon /> Go Back
        </Link>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* 📊 DASHBOARD */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 shadow rounded">
            <p className="text-sm text-gray-500">Entries</p>
            <p className="text-xl font-bold">{filteredEntries.length}</p>
          </div>

          <div className="bg-white p-4 shadow rounded">
            <p className="text-sm text-gray-500">Total Debit</p>
            <p className="text-xl font-bold">{totalDebit}</p>
          </div>

          <div className="bg-white p-4 shadow rounded">
            <p className="text-sm text-gray-500">Total Credit</p>
            <p className="text-xl font-bold">{totalCredit}</p>
          </div>

          <div className="bg-white p-4 shadow rounded">
            <p className="text-sm text-gray-500">Difference</p>
            <p className="text-xl font-bold">{difference}</p>
          </div>
        </div>

        {/* 🔍 FILTERS */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">All Years</option>
            <option>2026</option>
            <option>2025</option>
          </select>
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
          <input
            type="date"
            className="border p-2"
            max={today}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            className="border p-2"
            max={today}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {/* 📊 TABLE */}
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">S.No</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Customer Name</th>
              <th className="border p-2">Products</th>
              <th className="border p-2 text-right">Debit</th>
              <th className="border p-2 text-right">Credit</th>
              {/* <th className="border p-2 text-right">Balance</th> */}
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {processedData.map((item, index) => (
              <tr key={item.voucher_id}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2">{item.date}</td>

                <td className="border p-2">
                  <div>{formData.customer_name}</div>
                  <div className="text-xs text-gray-500">
                    {formData.customer_no}
                  </div>
                </td>
                <td className="border p-2">
                  <div>{item.product}</div>
                  <div className="text-xs text-gray-500">
                    {item.description}
                  </div>
                </td>

                <td className="border p-2 text-right">{item.debit || ""}</td>
                <td className="border p-2 text-right">{item.credit || ""}</td>

                {/* <td className="border p-2 text-right font-semibold">
                  {item.balance}
                </td> */}

                <td className="border p-2">
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    {/* <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          {/* 🔥 FOOTER */}{" "}
          <tfoot>
            {" "}
            {/* Closing Balance Row */}{" "}
            <tr className="font-semibold">
              {" "}
              <td colSpan={4} className="p-2 text-right">
                {" "}
                Closing Balance{" "}
              </td>{" "}
              <td className="p-2 text-right">
                {" "}
                {totalCredit > totalDebit ? (
                  <span className="bg-yellow-200 px-2">
                    {" "}
                    {difference.toLocaleString()}{" "}
                  </span>
                ) : (
                  ""
                )}{" "}
              </td>{" "}
              <td className="p-2 text-right">
                {" "}
                {totalDebit > totalCredit ? (
                  <span className="bg-yellow-200 px-2">
                    {" "}
                    {difference.toLocaleString()}{" "}
                  </span>
                ) : (
                  ""
                )}{" "}
              </td>{" "}
              <td></td> <td></td>{" "}
            </tr>{" "}
            {/* Final Equal Totals */}{" "}
            <tr className="font-bold border-t">
              {" "}
              <td colSpan={4} className="p-2 text-right">
                {" "}
                Total{" "}
              </td>{" "}
              <td className="p-2 text-right">
                {finalDebit.toLocaleString()}
              </td>{" "}
              <td className="p-2 text-right">{finalCredit.toLocaleString()}</td>{" "}
              <td></td> <td></td>{" "}
            </tr>{" "}
          </tfoot>
        </table>
      </div>

      {/* 🧾 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 w-lg rounded shadow">
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? "Edit Entry" : "Add Entry"}
            </h2>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Voucher No.
                </label>
                <input
                  readOnly
                  className="w-full px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl font-mono font-semibold text-lg cursor-not-allowed"
                  value={form.voucher_id}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Customer Name
                </label>
                <input
                  readOnly
                  className="w-full px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl font-mono font-semibold text-lg cursor-not-allowed"
                  value={formData.customer_name}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Products <span className="text-red-700 pb-2">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none duration-200 shadow-sm"
                  value={form.product}
                  onChange={(e) =>
                    setForm({ ...form, product: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Description <span className="text-red-700 pb-2">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none duration-200 shadow-sm"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div>
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
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Debit
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none duration-200 shadow-sm"
                    value={form.debit}
                    onChange={(e) =>
                      setForm({ ...form, debit: Number(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Credit
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none duration-200 shadow-sm"
                    value={form.credit}
                    onChange={(e) =>
                      setForm({ ...form, credit: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-12 py-1 border rounded-lg bg-blue-600 text-white"
                >
                  {isEditing
                    ? loading
                      ? "Updating..."
                      : "Update"
                    : loading
                      ? "Adding..."
                      : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ➕ ADD BUTTON */}
      <div className="fixed bottom-8 right-8 z-10">
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
            loadNumber();
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Entry
        </button>
      </div>
    </div>
  );
}
