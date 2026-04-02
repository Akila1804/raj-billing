/* eslint-disable react-hooks/purity */
"use client";
import axios from "axios";
import { Download, ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { numberToWords } from "./NumberToWords";
import Link from "next/link";
import { INVOICE } from "@/constants/path";
import {
  ACCOUNT_NUMBER,
  ACCOUNT_NUMBER_2,
  BANK_NAME,
  BANK_NAME_2,
  IFSC_CODE,
  IFSC_CODE_2,
} from "@/constants/data";
import { toTitleCase } from "@/constants/function";

const PreviewInvoice = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    customerName: "",
    address: "",
    gst: "",
    phone: "",
    invoiceNo: "",
    city: "",
    date: new Date().toISOString().split("T")[0],
    packing: 0,
    cgst: 9,
    sgst: 9,
    igst: 0,
    terms_from_date: 0,
    terms_to_date: 0,
  });

  const [products, setProducts] = useState([
    { id: Date.now(), name: "", qty: 0, rate: 0, amount: 0 },
  ]);

  useEffect(() => {
    if (id) {
      const fetchInvoiceData = async () => {
        try {
          const response = await axios.get("/api/invoice", {
            params: { id },
          });

          const invoice = response.data;

          setForm({
            customerName: invoice.customerName,
            address: invoice.address,
            gst: invoice.gst,
            phone: invoice.phone,
            invoiceNo: invoice.invoiceNo,
            city: invoice.city,
            date: invoice.date.split("T")[0],
            packing: invoice.packing,
            cgst: invoice.cgst_percent,
            sgst: invoice.sgst_percent,
            igst: invoice.igst_percent,
            terms_from_date: invoice.terms_from_date,
            terms_to_date: invoice.terms_to_date,
          });

          setProducts(
            typeof invoice.products === "string"
              ? JSON.parse(invoice.products)
              : invoice.products || [],
          );
        } catch (error) {
          console.error("Error fetching Invoice data:", error);
        }
      };

      fetchInvoiceData();
    }
  }, [id]);

  const subTotal = products.reduce((sum, p) => sum + p.amount, 0);
  const taxableAmount = subTotal + Number(form.packing);
  const cgstAmount = (taxableAmount * form.cgst) / 100;
  const sgstAmount = (taxableAmount * form.sgst) / 100;
  const igstAmount = (taxableAmount * form.igst) / 100;

  const grandTotal = taxableAmount + cgstAmount + sgstAmount + igstAmount;

  const amountInWords = numberToWords(Math.round(grandTotal));
  const isMoreProducts = products.length > 5;

  const downloadJPG = async () => {
    if (!invoiceRef.current) return;

    const images = invoiceRef.current.querySelectorAll("img");

    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve(true);
            else img.onload = () => resolve(true);
          }),
      ),
    );

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 3, // high quality
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.9); // better quality JPG

    const link = document.createElement("a");
    link.href = imgData;
    link.download = `${form.invoiceNo}.jpg`;
    link.click();
  };

  // const handlePrint = () => {
  //   window.print();
  // };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="print:hidden bg-white border-b shadow-sm flex justify-between items-center">
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
      <div className="bg-gray-200 pl-10 pt-5 print:hidden">
        <Link href={INVOICE} className="text-red-700 flex gap-3 items-center">
          <ArrowLeftIcon /> Go Back
        </Link>
      </div>
      <div className="flex justify-center bg-gray-200 pb-10">
        <div
          ref={invoiceRef}
          className="flex flex-col print-container"
          style={{
            width: "210mm",
            minHeight: "297mm",
            overflow: "hidden",
            background: "white",
            color: "black",
            border: "5px solid #0b95a9",
            padding: "5mm",
            paddingTop: "2mm",
            boxSizing: "border-box",
          }}
        >
          {/* Top Dark Bar */}
          {/* <div className="h-2 bg-[#0b95a9] w-full" /> */}
          <div className="print-inner">
            <div className=" text-black">
              {/* Header */}
              <div className="text-right text-md">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(form.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-center flex justify-center flex-col items-center ">
                <h1
                  className={`  font-bold tracking-wide text-[#0b95a9] ${
                    isMoreProducts ? "text-base" : "text-xl"
                  }`}
                >
                  INVOICE SLIP
                </h1>
              </div>

              {/* Header Info */}
              {/* <div className="flex flex-col lg:flex-row justify-between items-start mb-2 gap-8">
              <div className="flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={600}
                  height={600}
                  className="w-48 h-20 object-contain"
                />
              </div>
            </div> */}

              {/* Bill From & Bill To */}
              <div className=" flex col-span-2 gap-2 border-black rounded-lg ">
                <div className="p-4 py-2 rounded-lg w-full text-sm">
                  <h3
                    className={`font-bold mb-1 text-black border-b pb-2 ${
                      isMoreProducts ? "text-[12px]" : "text-xl"
                    }`}
                  >
                    Bill From
                  </h3>

                  {/* <div className="flex items-center text-center gap-2 font-bold text-xl text-[#1a8393]"> */}
                  {/* <img
                    src="/smalllogo.png"
                    alt="Logo"
                    width="42"
                    height="42"
                    style={{ objectFit: "fill", marginTop: "3px" }}
                  /> */}
                  {/* <span>Raj Printers</span>
                </div> */}
                  <div className="align-middle">
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="block h-11 w-auto object-contain align-middle"
                    />
                  </div>
                  <p
                    className={`${isMoreProducts ? "text-[10px]" : "text-sm"}`}
                  >
                    862/4, Bypass Road Sivakasi, Tamil Nadu
                  </p>

                  <p
                    className={`${isMoreProducts ? "text-[10px]" : "text-sm"}`}
                  >
                    <strong>Phone:</strong> +91 98423 66710
                  </p>

                  <p
                    className={`${isMoreProducts ? "text-[10px]" : "text-sm"}`}
                  >
                    <strong>Email:</strong> rajprinterssvks@gmail.com
                  </p>

                  <p
                    className={`${isMoreProducts ? "text-[10px]" : "text-sm"}`}
                  >
                    <strong>Website:</strong> www.rajprinters.com
                  </p>

                  <p
                    className={`font-mono ${isMoreProducts ? "text-[10px]" : "text-sm"}`}
                  >
                    <strong>GST:</strong> 33ABAFR4520K1ZE
                  </p>
                </div>

                <div className="p-4 py-2 rounded-lg w-full text-sm ">
                  <h3
                    className={`font-bold mb-1 text-black border-b pb-2 ${
                      isMoreProducts ? "text-[12px]" : "text-xl"
                    }`}
                  >
                    Bill To
                  </h3>
                  <div className="">
                    <p className="text-[#ff0000]">
                      <strong className="text-black">Invoice No: </strong>{" "}
                      {form.invoiceNo}
                    </p>

                    <p
                      className={`${isMoreProducts ? "text-[12px] text-[#0b95a9] font-bold" : "text-sm"}`}
                    >
                      <strong className="text-black font-medium">Name:</strong>{" "}
                      {form.customerName}
                    </p>
                    <p
                      className={`${isMoreProducts ? "text-[10px]" : "text-sm"}`}
                    >
                      <strong>Address:</strong> {form.address}
                    </p>
                    <p
                      className={`${isMoreProducts ? "text-[10px]" : "text-sm"}`}
                    >
                      <strong>City:</strong> {form.city}
                    </p>
                    <p
                      className={`${isMoreProducts ? "text-[10px]" : "text-sm"}`}
                    >
                      <strong>Phone:</strong> {form.phone}
                    </p>
                    {form.gst && (
                      <p
                        className={`${isMoreProducts ? "text-[10px]" : "text-sm"}`}
                      >
                        <strong>GST:</strong> {form.gst}
                      </p>
                    )}
                    {/* <p>
                    <strong>Date:</strong>{" "}
                    {new Date(form.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p> */}
                  </div>
                </div>
              </div>

              {/* Products Table */}
              <div className="mb-3 ">
                <table
                  className={`w-full border-collapse border  ${isMoreProducts ? "text-[13px]" : "text-sm"}`}
                >
                  <thead>
                    <tr className=" text-black">
                      <th className="border border-black p-2 text-center font-bold rounded-tl-lg">
                        No
                      </th>
                      <th className="border border-black p-2 text-left font-bold">
                        Description
                      </th>
                      <th className="border border-black p-2 text-center font-bold">
                        Qty
                      </th>
                      <th className="border border-black p-2 text-center font-bold">
                        Rate
                      </th>
                      <th className="border border-black p-2 text-right font-bold rounded-tr-lg">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p, index) => {
                      const isLastRow = index === products.length - 1;
                      return (
                        <tr key={p.id}>
                          <td
                            className={`border border-[#b4b4b4] p-0.5 mb-1.5 text-center font-medium ${isLastRow ? "rounded-bl-lg" : ""} ${
                              isMoreProducts ? "text-[12px]" : "text-sm"
                            }`}
                          >
                            {index + 1}
                          </td>
                          <td
                            className={`border border-[#b4b4b4] p-0.5 mb-1.5 pb-1.5 font-medium break-all max-w-[300px] ${isLastRow ? "" : ""} ${
                              isMoreProducts ? "text-[12px]" : "text-sm"
                            }`}
                          >
                            {toTitleCase(p.name)}
                          </td>
                          <td
                            className={`border border-[#b4b4b4] p-0.5 mb-1.5 pb-1.5 text-center font-medium ${isLastRow ? "" : ""} ${
                              isMoreProducts ? "text-[12px]" : "text-sm"
                            }`}
                          >
                            {p.qty}
                          </td>
                          <td
                            className={`border border-[#b4b4b4] p-0.5 mb-1.5 pb-1.5 text-right font-medium ${isLastRow ? "" : ""} ${
                              isMoreProducts ? "text-[12px]" : "text-sm"
                            }`}
                          >
                            ₹ {p.rate.toLocaleString()}
                          </td>
                          <td
                            className={`border border-[#b4b4b4] p-0.5 mb-1.5 pb-1.5 text-right font-bold text-base ${isLastRow ? "rounded-br-lg" : ""} ${
                              isMoreProducts ? "text-[12px]" : "text-sm"
                            }`}
                          >
                            ₹ {p.amount.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bottom Section: Terms, Totals, Amount in Words */}
              <div className=" gap-8 mb-2">
                {/* Amount Box */}
                <div className=" border border-black p-2 pb-0 rounded-lg lg:col-span-2">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between font-medium">
                      <span>Subtotal</span>
                      <span>₹ {subTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Packing</span>
                      <span>₹ {Number(form.packing).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-bold text-base">
                        Taxable Amount
                      </span>
                      <span className="font-bold text-base">
                        ₹ {taxableAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span>CGST ({form.cgst}%)</span>
                      <span>₹ {cgstAmount}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span>SGST ({form.sgst}%)</span>
                      <span>₹ {sgstAmount}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span>IGST ({form.igst}%)</span>
                      <span>₹ {igstAmount}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-bold text-black mb-2">
                        <span>Amount Chargeable</span>
                        <span className="text-[#c10d0d]">
                          ₹ {grandTotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs mb-1 p-2 rounded border-dashed border border-black ">
                        INR
                        <strong className="capitalize font-bold text-[#ff0404] ">
                          {" "}
                          {amountInWords}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex col-span-2 gap-6 my-2 mb-1">
                <div
                  className={`p-2 pt-0 rounded-lg w-full ${
                    isMoreProducts ? "bank-compact" : ""
                  }`}
                >
                  <h3 className="font-bold text-base pb-1 text-[#1a6977] border-b">
                    Bank Details
                  </h3>

                  <div
                    className={`grid grid-cols-3 gap-6  mt-2 ${
                      isMoreProducts ? "text-[10px]" : "text-sm"
                    }`}
                  >
                    {/* Bank Account 1 */}
                    <div className="space-y-1">
                      <p className="font-bold text-sm">Bank Account 1</p>
                      <p>
                        <strong>Bank:</strong> {BANK_NAME}
                      </p>
                      <p>
                        <strong>A/c No:</strong> {ACCOUNT_NUMBER}
                      </p>
                      <p>
                        <strong>IFSC:</strong> {IFSC_CODE}
                      </p>
                      <p>
                        <strong>Branch:</strong> Sivakasi
                      </p>
                    </div>

                    {/* Bank Account 2 */}
                    <div className="space-y-1">
                      <p className="font-bold text-sm">Bank Account 2</p>
                      <p>
                        <strong>Bank:</strong> {BANK_NAME_2}
                      </p>
                      <p>
                        <strong>A/c No:</strong> {ACCOUNT_NUMBER_2}
                      </p>
                      <p>
                        <strong>IFSC:</strong> {IFSC_CODE_2}
                      </p>
                      <p>
                        <strong>Branch:</strong> Sivakasi
                      </p>
                    </div>

                    {/* UPI / GPay */}
                    <div className="space-y-1">
                      <p className="font-bold text-base">GPay</p>
                      <p>
                        <strong>GPay Number:</strong> 9842366710
                      </p>
                      <p>
                        <strong>GPay Number:</strong> 8838290321
                      </p>
                      {/* <p>
                      <strong>UPI ID:</strong> rajprinters@okaxis
                    </p> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <h3 className="font-bold text-sm pb-1 text-black border-b w-fit">
                  Terms & Conditions
                </h3>
                <div className="list-disc text-[10px] text-black pt-1 pl-2">
                  Design Your&apos;s Scope, GST Extra, Freight Charge, Extra
                  100% Advance Will be accompained while placing the order, The
                  good delivery with in{" "}
                  <span className="text-[#f00]"> {form.terms_from_date} </span>
                  to <span className="text-[#f00]">
                    {" "}
                    {form.terms_to_date}{" "}
                  </span>{" "}
                  days, Goods once sold will not be taken back or exchanged.
                </div>
              </div>
              {/* Bank Details */}
              {/* <div className="w-full">
              <h3 className="font-bold text-lg pb-1 text-black border-b">
                Declaration:
                <span className="text-sm">(For Raj Printers)</span>
              </h3>
              <div className="text-[10px] text-black space-y-2  pt-2">
                <p>
                  We declare that this invoice is made in good faith based on
                  current market rates and specifications provided. Final
                  billing will be as per actual work executed.
                </p>
              </div>
            </div> */}
            </div>
            <div style={{ marginTop: "4px" }}>
              {/* Footer */}
              <div className=" text-center text-sm text-black space-y-2">
                <div className="flex justify-end items-end pb-2">
                  {/* <div>
                  <p className="font-semibold">Payment Info</p>
                  <p>Bank Transfer / Cash / UPI</p>
                </div> */}
                  <div className="text-right">
                    <img
                      src="/sign.jpeg"
                      alt="Logo"
                      className="block h-11 w-auto object-contain align-middle"
                    />
                    <div className="flex items-end justify-center mb-1">
                      <span className="bg-white px-2 border-dashed border-black border-t">
                        Authorized Signature
                      </span>
                    </div>
                    <p className="font-bold text-center text-black">
                      Raj Printers
                    </p>
                  </div>
                </div>
                {/* <p className="text-xs bg-white pb-2 rounded">
                This is a computer generated Invoice
              </p> */}
              </div>
              {/* Bottom Bar */}
              <div className="h-2 bg-[#0b95a9]" />
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-8 right-8 z-10 print:hidden">
        <button
          onClick={downloadJPG}
          // onClick={handlePrint}
          className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition"
        >
          <Download size={20} />
          Download Image
        </button>
      </div>
    </div>
  );
};

export default PreviewInvoice;

<style jsx global>{`
  * {
    margin: 0 !important;
  }

  p {
    margin: 0 !important;
  }

  h1,
  h2,
  h3 {
    margin: 2px 0 !important;
  }
  @page {
    size: A4 portrait;
    margin: 0; /* IMPORTANT */
  }

  @media print {
    html,
    body {
      background: #ffffff !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      overflow: hidden !important;
    }

    /* Hide UI */
    button,
    a {
      display: none !important;
    }
    .bank-compact {
      font-size: 10px !important;
    }

    .bank-compact h3 {
      font-size: 12px !important;
    }

    .bank-compact p {
      margin: 1px 0 !important;
    }

    .bank-compact .grid {
      gap: 8px !important;
    }

    /* Even tighter for print */

    .bank-compact {
      font-size: 9px !important;
    }

    .bank-compact h3 {
      font-size: 11px !important;
    }

    .bank-compact p {
      margin: 0 !important;
      line-height: 1.2 !important;
    }

    .bank-compact {
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }
    .print-container {
      width: 210mm;
      height: 285mm !important; /* SAFE */
      max-height: 285mm !important;
      overflow: hidden;
      padding: 1mm;
      margin: 0 auto;
      background: white;
      box-sizing: border-box;
      transform: scale(0.97);
      transform-origin: top;
      page-break-after: avoid !important;
      page-break-before: avoid !important;
    }

    .print-inner {
      border: 3px solid #0b95a9;
      height: 100%;
      box-sizing: border-box;
    }
    .print-container > div {
      margin: 0 !important;
      padding: 0 !important;
    }

    /* Remove shadows/backgrounds */
    .bg-gray-50,
    .bg-gray-200 {
      background: white !important;
    }

    /* Avoid page breaks inside */
    table,
    tr,
    td,
    div {
      page-break-inside: avoid;
    }

    .table-compact td,
    .table-compact th {
      padding: 3px !important;
      font-size: 10px !important;
    }
    table td,
    table th {
      padding: 3px !important;
      line-height: 1.2 !important;
    }

    /* Force full width */
    img {
      max-width: 100% !important;
    }
  }
`}</style>;
