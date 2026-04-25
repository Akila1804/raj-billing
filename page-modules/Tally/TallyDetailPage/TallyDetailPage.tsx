"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";
import { generateVocherNumber } from "./generateVoucherNo";
import Link from "next/link";
import { ArrowLeftIcon, PrinterIcon } from "lucide-react";
import { TALLY } from "@/constants/path";
import { Entry, Member } from "@/types/tally";

const PRINT_PAGE_UNITS = 35;

const formatDate = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
};

const formatAmount = (value: number) => {
  if (!value) return "";
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatRangeDate = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const countWrappedLines = (text: string, charsPerLine: number) => {
  if (!text) return 0;
  return text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .reduce(
      (sum, line) =>
        sum + Math.max(1, Math.ceil(line.trim().length / charsPerLine)),
      0,
    );
};

const estimateRowUnits = (entry: Entry) => {
  const productLines = countWrappedLines(entry.product || "", 34);
  const descriptionLines = countWrappedLines(entry.description || "", 42);
  return Math.max(1, productLines + descriptionLines);
};

type PrintPage = {
  pageNumber: number;
  openingDebit: number;
  openingCredit: number;
  entries: Array<Entry & { rowUnits: number }>;
  carriedDebit: number;
  carriedCredit: number;
  hasCarryForward: boolean;
};

export default function LedgerPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setloading] = useState(false);
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
          setEntries(responseData.data);
        } catch (error) {
          console.error("Error fetching Members data:", error);
        }
      };

      fetchMemberData();
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!form.date || !form.product) {
      Swal.fire("Please fill all required fields (marked with *)");
      return;
    }

    try {
      setloading(true);
      if (isEditing) {
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
      } else {
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

        if (data) {
          setEntries((prev) => [...prev, data[0]]);
        }

        Swal.fire("Successfully Added", "Entry added successfully!", "success");
      }

      resetForm();
      setShowModal(false);
      setIsEditing(false);
    } catch (err: unknown) {
      console.error(err);
      Swal.fire("Error saving estimation");
    } finally {
      setloading(false);
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

  const filteredEntries = useMemo(() => {
    return entries
      .filter((item) => {
        const d = new Date(item.date);

        if (year && d.getFullYear() !== Number(year)) return false;
        if (month && d.getMonth() + 1 !== Number(month)) return false;
        if (fromDate && new Date(item.date) < new Date(fromDate)) return false;
        if (toDate && new Date(item.date) > new Date(toDate)) return false;

        return true;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [entries, year, month, fromDate, toDate]);

  const totalDebit = filteredEntries.reduce(
    (sum, i) => sum + (i.debit || 0),
    0,
  );
  const totalCredit = filteredEntries.reduce(
    (sum, i) => sum + (i.credit || 0),
    0,
  );
  const difference = Math.abs(totalDebit - totalCredit);

  const finalDebit =
    totalDebit > totalCredit ? totalDebit : totalDebit + difference;
  const finalCredit =
    totalCredit > totalDebit ? totalCredit : totalCredit + difference;

  const periodLabel = useMemo(() => {
    const from = fromDate || filteredEntries[0]?.date;
    const to = toDate || filteredEntries[filteredEntries.length - 1]?.date;

    if (!from && !to) return "All Entries";
    if (from && to) return `${formatRangeDate(from)} to ${formatRangeDate(to)}`;
    return formatRangeDate(from || to || "");
  }, [fromDate, toDate, filteredEntries]);

  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => {
      const numA = Number(a.voucher_id.replace(/\D/g, ""));
      const numB = Number(b.voucher_id.replace(/\D/g, ""));
      return numA - numB;
    });
  }, [filteredEntries]);

  const printPages = useMemo<PrintPage[]>(() => {
    if (sortedEntries.length === 0) return [];

    const pages: PrintPage[] = [];
    let runningDebit = 0;
    let runningCredit = 0;
    let index = 0;
    let pageNumber = 1;

    while (index < sortedEntries.length) {
      const openingDebit = runningDebit;
      const openingCredit = runningCredit;
      const pageEntries: Array<Entry & { rowUnits: number }> = [];
      let usedUnits = pageNumber > 1 ? 1 : 0;

      while (index < sortedEntries.length) {
        const current = sortedEntries[index];
        const rowUnits = estimateRowUnits(current);
        const reserveUnits = index < sortedEntries.length - 1 ? 1 : 2;

        if (usedUnits + rowUnits + reserveUnits > PRINT_PAGE_UNITS) {
          if (pageEntries.length === 0) {
            pageEntries.push({ ...current, rowUnits });
            runningDebit += current.debit || 0;
            runningCredit += current.credit || 0;
            index += 1;
          }
          break;
        }

        pageEntries.push({ ...current, rowUnits });
        usedUnits += rowUnits;
        runningDebit += current.debit || 0;
        runningCredit += current.credit || 0;
        index += 1;
      }

      pages.push({
        pageNumber,
        openingDebit,
        openingCredit,
        entries: pageEntries,
        carriedDebit: runningDebit,
        carriedCredit: runningCredit,
        hasCarryForward: index < sortedEntries.length,
      });
      pageNumber += 1;
    }

    return pages;
  }, [sortedEntries]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white print:min-h-0">
      <div className="bg-white border-b shadow-sm flex justify-between items-center px-6 py-2 print:hidden">
        <Image src="/logo.png" alt="Logo" width={200} height={60} />
      </div>

      <div className="pl-10 pt-5 flex items-center justify-between pr-10 print:hidden">
        <Link href={TALLY} className="text-red-700 flex gap-3 items-center">
          <ArrowLeftIcon /> Go Back
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
        >
          <PrinterIcon size={16} />
          Print A4 PDF
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 print:max-w-none print:px-0 print:py-0">
        <div className="grid grid-cols-4 gap-4 mb-6 print:hidden">
          <div className="bg-white p-4 shadow rounded">
            <p className="text-sm text-gray-500">Entries</p>
            <p className="text-xl font-bold">{filteredEntries.length}</p>
          </div>

          <div className="bg-white p-4 shadow rounded">
            <p className="text-sm text-gray-500">Total Debit</p>
            <p className="text-xl font-bold">{formatAmount(totalDebit)}</p>
          </div>

          <div className="bg-white p-4 shadow rounded">
            <p className="text-sm text-gray-500">Total Credit</p>
            <p className="text-xl font-bold">{formatAmount(totalCredit)}</p>
          </div>

          <div className="bg-white p-4 shadow rounded">
            <p className="text-sm text-gray-500">Difference</p>
            <p className="text-xl font-bold">{formatAmount(difference)}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6 print:hidden">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm h-14 w-full"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">All Months</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <input
            type="date"
            className="border p-2"
            max={today}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            className="border p-2"
            max={today}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="bg-white shadow-sm rounded-xl overflow-hidden print:hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-center">S.No</th>
                  <th className="border p-2 text-left">Date</th>
                  <th className="border p-2 text-left">Particulars</th>
                  {/* <th className="border p-2 text-left w-[90px]">Vch Type</th> */}
                  <th className="border p-2 text-center w-[130px]">Vch No.</th>
                  <th className="border p-2 text-right w-[140px]">Debit</th>
                  <th className="border p-2 text-right w-[140px]">Credit</th>
                  <th className="border p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedEntries.length === 0 ? (
                  <tr>
                    <td
                      className="border p-3 text-center text-gray-500"
                      colSpan={7}
                    >
                      No ledger entries found
                    </td>
                  </tr>
                ) : (
                  sortedEntries.map((item, index) => (
                    <tr key={item.voucher_id}>
                      <td className="border p-2 align-top">{index + 1}</td>
                      <td className="border p-2 align-top">
                        {formatDate(item.date)}
                      </td>
                      <td className="border p-2 align-top">
                        <div>{item.product}</div>
                        {item.description ? (
                          <div className="text-xs text-gray-500 whitespace-pre-wrap">
                            {item.description}
                          </div>
                        ) : null}
                      </td>
                      {/* <td className="border p-2 align-top">Voucher</td> */}
                      <td className="border p-2 align-top">
                        {item.voucher_id}
                      </td>
                      <td className="border p-2 text-right align-top">
                        {formatAmount(item.debit || 0)}
                      </td>
                      <td className="border p-2 text-right align-top">
                        {formatAmount(item.credit || 0)}
                      </td>
                      <td className="border p-2">
                        <div className="flex gap-4 justify-center">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="font-semibold">
                  <td colSpan={4} className="border p-2 text-right">
                    Closing Balance
                  </td>
                  <td className="border p-2 text-right">
                    {totalCredit > totalDebit ? (
                      <span className="inline-block rounded bg-yellow-300 px-2 py-1">
                        {formatAmount(difference)}
                      </span>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="border p-2 text-right">
                    {totalDebit > totalCredit ? (
                      <span className="inline-block rounded bg-yellow-300 px-2 py-1">
                        {formatAmount(difference)}
                      </span>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="border p-2"></td>
                </tr>
                <tr className="font-bold border-t">
                  <td colSpan={4} className="border p-2 text-right">
                    Total
                  </td>
                  <td className="border p-2 text-right">
                    {formatAmount(finalDebit)}
                  </td>
                  <td className="border p-2 text-right">
                    {formatAmount(finalCredit)}
                  </td>
                  <td className="border p-2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="hidden print:block print-ledger-pages">
          {printPages.length === 0 ? (
            <div className="print-ledger-empty">No ledger entries found</div>
          ) : (
            printPages.map((page, idx) => (
              <div
                key={`print-page-${page.pageNumber}`}
                className="print-ledger-page"
              >
                <div className="print-ledger-header">
                  <div className="print-company-name">RAJ PRINTERS</div>
                  <div className="print-company-address">
                    862/4, Bypass Road Sivakasi, Tamil Nadu{" "}
                  </div>
                  <div className="print-company-address">
                    Contact : +91 98423 66710
                  </div>
                  <div className="print-ledger-title-row">
                    <div>
                      <div className="print-ledger-name">
                        {formData.customer_name}
                      </div>
                      <div className="print-ledger-subtitle">
                        Ledger Account
                      </div>
                      <div className="print-ledger-subtitle">{periodLabel}</div>
                    </div>
                    <div className="print-ledger-page-number">
                      Page {page.pageNumber}
                    </div>
                  </div>
                </div>

                <table className="print-ledger-table">
                  <thead>
                    <tr>
                      <th className="print-ledger-cell print-ledger-head print-col-date">
                        S.No
                      </th>
                      <th className="print-ledger-cell print-ledger-head print-col-date">
                        Date
                      </th>
                      <th className="print-ledger-cell print-ledger-head">
                        Particulars
                      </th>

                      <th className="print-ledger-cell print-ledger-head print-col-no">
                        Vch No.
                      </th>
                      <th className="print-ledger-cell print-ledger-head print-col-amount">
                        Debit
                      </th>
                      <th className="print-ledger-cell print-ledger-head print-col-amount">
                        Credit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.pageNumber > 1 ? (
                      <tr className="print-ledger-summary-row">
                        <td className="print-ledger-cell"></td>
                        <td className="print-ledger-cell font-semibold">
                          Brought Forward
                        </td>
                        <td className="print-ledger-cell"></td>
                        <td className="print-ledger-cell"></td>
                        <td className="print-ledger-cell text-right">
                          {formatAmount(page.openingDebit)}
                        </td>
                        <td className="print-ledger-cell text-right">
                          {formatAmount(page.openingCredit)}
                        </td>
                      </tr>
                    ) : null}

                    {page.entries.map((item, index) => (
                      <tr key={`print-${page.pageNumber}-${item.voucher_id}`}>
                        <td className="print-ledger-cell align-top">
                          {index + 1}
                        </td>
                        <td className="print-ledger-cell align-top">
                          {formatDate(item.date)}
                        </td>
                        <td className="print-ledger-cell align-top">
                          <div className="whitespace-pre-wrap">
                            {item.product}
                          </div>
                          {item.description ? (
                            <div className="print-ledger-desc whitespace-pre-wrap">
                              {item.description}
                            </div>
                          ) : null}
                        </td>

                        <td className="print-ledger-cell align-top">
                          {item.voucher_id}
                        </td>
                        <td className="print-ledger-cell text-right align-top">
                          {formatAmount(item.debit || 0)}
                        </td>
                        <td className="print-ledger-cell text-right align-top">
                          {formatAmount(item.credit || 0)}
                        </td>
                      </tr>
                    ))}

                    {page.hasCarryForward ? (
                      <tr className="print-ledger-summary-row">
                        <td className="print-ledger-cell"></td>
                        <td className="print-ledger-cell font-semibold">
                          Carried Over
                        </td>
                        <td className="print-ledger-cell"></td>
                        <td className="print-ledger-cell"></td>
                        <td className="print-ledger-cell text-right">
                          {formatAmount(page.carriedDebit)}
                        </td>
                        <td className="print-ledger-cell text-right">
                          {formatAmount(page.carriedCredit)}
                        </td>
                      </tr>
                    ) : (
                      <>
                        <tr className="print-ledger-summary-row">
                          <td className="print-ledger-cell"></td>
                          <td className="print-ledger-cell font-semibold">
                            Closing Balance
                          </td>
                          <td className="print-ledger-cell"></td>
                          <td className="print-ledger-cell"></td>
                          <td className="print-ledger-cell text-right">
                            {totalCredit > totalDebit
                              ? formatAmount(difference)
                              : ""}
                          </td>
                          <td className="print-ledger-cell text-right">
                            {totalDebit > totalCredit
                              ? formatAmount(difference)
                              : ""}
                          </td>
                        </tr>
                        <tr className="print-ledger-summary-row print-ledger-grand-total">
                          <td className="print-ledger-cell"></td>
                          <td className="print-ledger-cell font-bold">Total</td>
                          <td className="print-ledger-cell"></td>
                          <td className="print-ledger-cell"></td>
                          <td className="print-ledger-cell text-right font-bold">
                            {formatAmount(finalDebit)}
                          </td>
                          <td className="print-ledger-cell text-right font-bold">
                            {formatAmount(finalCredit)}
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>

                {page.hasCarryForward ? (
                  <div className="print-ledger-continued">
                    continued ... RAJ PRINTERS
                  </div>
                ) : null}

                {idx < printPages.length - 1 ? (
                  <div className="print-page-break" />
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center print:hidden">
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

      <div className="fixed bottom-8 right-8 z-10 print:hidden">
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

      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 12mm;
        }

        @media print {
          html,
          body {
            background: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .print-ledger-pages {
            display: block !important;
            font-family: Arial, Helvetica, sans-serif;
            color: #000;
          }

          .print-ledger-page {
            width: 100%;
            min-height: 0;
          }

          .print-ledger-header {
            border-bottom: 1px solid #000;
            padding-bottom: 6px;
            margin-bottom: 8px;
          }

          .print-company-name {
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }

          .print-company-address,
          .print-ledger-subtitle,
          .print-ledger-page-number {
            font-size: 11px;
            line-height: 1.35;
          }

          .print-ledger-title-row {
            margin-top: 8px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 12px;
          }

          .print-ledger-name {
            font-size: 16px;
            font-weight: 600;
          }

          .print-ledger-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            font-size: 11px;
          }

          .print-ledger-cell {
            border: 1px solid #000 !important;
            padding: 4px 6px !important;
            vertical-align: top;
            word-break: break-word;
          }

          .print-ledger-head {
            font-weight: 700;
          }

          .print-col-date {
            width: 14%;
          }

          .print-col-type,
          .print-col-no {
            width: 12%;
          }

          .print-col-amount {
            width: 14%;
            text-align: right;
          }

          .print-ledger-desc {
            color: #222;
            margin-top: 2px;
          }

          .print-ledger-summary-row {
            page-break-inside: avoid;
          }

          .print-ledger-grand-total td {
            font-weight: 700;
          }

          .print-ledger-continued {
            margin-top: 4px;
            font-size: 11px;
          }

          .print-page-break {
            break-after: page;
            page-break-after: always;
            height: 0;
          }

          .print-ledger-empty {
            font-size: 12px;
          }

          button,
          input,
          select,
          textarea,
          a {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
