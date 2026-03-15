/* eslint-disable react-hooks/purity */
"use client";
import axios from "axios";
import { Download, ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { numberToWords } from "./NumberToWords";
import Link from "next/link";
import { ESTIMATION } from "@/constants/path";
const PreviewEstimate = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const invoiceRef = useRef<HTMLDivElement>(null);

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

  const [products, setProducts] = useState([
    { id: Date.now(), name: "", qty: 0, rate: 0, amount: 0 },
  ]);

  useEffect(() => {
    if (id) {
      const fetchEstimateData = async () => {
        try {
          const response = await axios.get("/api/estimate", {
            params: { id },
          });

          const estimate = response.data;

          setForm({
            customerName: estimate.customerName,
            address: estimate.address,
            gst: estimate.gst,
            phone: estimate.phone,
            estimationNo: estimate.estimationNo,
            city: estimate.city,
            date: estimate.date.split("T")[0],
            packing: estimate.packing,
            cgst: estimate.cgst_percent,
            sgst: estimate.sgst_percent,
          });

          setProducts(
            typeof estimate.products === "string"
              ? JSON.parse(estimate.products)
              : estimate.products || [],
          );
        } catch (error) {
          console.error("Error fetching Estimate data:", error);
        }
      };

      fetchEstimateData();
    }
  }, [id]);

  const subTotal = products.reduce((sum, p) => sum + p.amount, 0);
  const taxableAmount = subTotal + Number(form.packing);
  const cgstAmount = (taxableAmount * form.cgst) / 100;
  const sgstAmount = (taxableAmount * form.sgst) / 100;
  const grandTotal = taxableAmount + cgstAmount + sgstAmount;

  const amountInWords = numberToWords(Math.round(grandTotal));

  const downloadImage = async () => {
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
      scale: 3, // increase scale for better quality
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.7); // compress image

    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

    const blob = pdf.output("blob");

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ordersummary.pdf";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm flex justify-between items-center">
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
      <div className="bg-gray-200 pl-10 pt-5">
        <Link
          href={ESTIMATION}
          className="text-red-700 flex gap-3 items-center"
        >
          <ArrowLeftIcon /> Go Back
        </Link>
      </div>
      <div className="flex justify-center bg-gray-200 pb-10">
        <div
          ref={invoiceRef}
          className="flex justify-between flex-col"
          style={{
            width: "210mm",
            minHeight: "297mm",
            background: "white",
            color: "black",
            padding: "10mm",
            paddingTop: "5mm",
            boxSizing: "border-box",
          }}
        >
          {/* Top Dark Bar */}
          {/* <div className="h-2 bg-[#0b95a9] w-full" /> */}

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
              <h1 className="text-xl  font-bold tracking-wide text-[#0b95a9]">
                ESTIMATION SLIP
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
            <div className=" flex col-span-2 gap-2 border-black rounded-lg mb-2 ">
              <div className="p-4 py-2 rounded-lg w-full text-sm">
                <h3 className="font-bold text-xl mb-1 text-black border-b pb-2">
                  Bill From
                </h3>

                <div className="flex items-center text-center gap-2 font-bold text-xl text-[#1a8393]">
                  {/* <img
                    src="/smalllogo.png"
                    alt="Logo"
                    width="42"
                    height="42"
                    style={{ objectFit: "fill", marginTop: "3px" }}
                  /> */}
                  <span>Raj Printers</span>
                </div>
                <p>862/4, Bypass Road Sivakasi, Tamil Nadu</p>

                <p>
                  <strong>Phone:</strong> +91 98423 66710
                </p>

                <p>
                  <strong>Email:</strong> rajprinterssvks@gmail.com
                </p>

                <p>
                  <strong>Website:</strong> www.rajprinters.com
                </p>

                <p className="font-mono">
                  <strong>GST:</strong> 33XXXXXXXXX
                </p>
              </div>

              <div className="p-4 py-2 rounded-lg w-full text-sm ">
                <h3 className="font-bold text-xl mb-1 text-black border-b pb-2">
                  Bill To
                </h3>
                <div className="">
                  <p className="text-[#ff0000]">
                    <strong className="text-black">Estimation No: </strong>{" "}
                    {form.estimationNo}
                  </p>

                  <p>
                    <strong>Name:</strong> {form.customerName}
                  </p>
                  <p>
                    <strong>Address:</strong> {form.address}
                  </p>
                  <p>
                    <strong>City:</strong> {form.city}
                  </p>
                  <p>
                    <strong>Phone:</strong> {form.phone}
                  </p>
                  {form.gst && (
                    <p>
                      <strong>GST:</strong> {form.gst}
                    </p>
                  )}
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(form.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="mb-3 ">
              <table className="w-full border-collapse border rounded-lg border-black text-sm">
                <thead>
                  <tr className=" text-black">
                    <th className="border border-black p-2 text-center font-bold">
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
                    <th className="border border-black p-2 text-right font-bold">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, index) => (
                    <tr key={p.id}>
                      <td className="border border-[#b4b4b4] p-0.5 text-center font-medium">
                        {index + 1}
                      </td>
                      <td className="border border-[#b4b4b4] p-0.5 font-medium">
                        {p.name}
                      </td>
                      <td className="border border-[#b4b4b4] p-0.5 text-center font-medium">
                        {p.qty}
                      </td>
                      <td className="border border-[#b4b4b4] p-0.5 text-right font-medium">
                        ₹ {p.rate.toLocaleString()}
                      </td>
                      <td className="border border-[#b4b4b4] p-0.5 text-right font-bold text-base">
                        ₹ {p.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
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
                    <span className="font-bold text-base">Taxable Amount</span>
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
              <div className="p-2 pt-0 rounded-lg w-full">
                <h3 className="font-bold text-base pb-1 text-[#1a6977] border-b">
                  Bank Details
                </h3>

                <div className="grid grid-cols-3 gap-6 text-sm mt-2">
                  {/* Bank Account 1 */}
                  <div className="space-y-1">
                    <p className="font-bold text-md">Bank Account 1</p>
                    <p>
                      <strong>Bank:</strong> State Bank of India
                    </p>
                    <p>
                      <strong>A/c No:</strong> 123456789012
                    </p>
                    <p>
                      <strong>IFSC:</strong> SBIN0001234
                    </p>
                    <p>
                      <strong>Branch:</strong> Sivakasi Main Branch
                    </p>
                  </div>

                  {/* Bank Account 2 */}
                  <div className="space-y-1">
                    <p className="font-bold text-md">Bank Account 2</p>
                    <p>
                      <strong>Bank:</strong> Indian Bank
                    </p>
                    <p>
                      <strong>A/c No:</strong> 987654321098
                    </p>
                    <p>
                      <strong>IFSC:</strong> IDIB000S123
                    </p>
                    <p>
                      <strong>Branch:</strong> Sivakasi
                    </p>
                  </div>

                  {/* UPI / GPay */}
                  <div className="space-y-1">
                    <p className="font-bold text-base">UPI / GPay</p>
                    <p>
                      <strong>GPay Number:</strong> 9842366710
                    </p>
                    <p>
                      <strong>UPI ID:</strong> rajprinters@okaxis
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <h3 className="font-bold text-sm pb-1 text-black border-b w-fit">
                Terms & Conditions
              </h3>
              <div className="list-disc text-[10px] text-black pt-1">
                Payment due upon confirmation of order. Price may change based
                on material cost fluctuations. GST extra as applicable. Goods
                once sold will not be taken back or exchanged. Delivery subject
                to stock availability.
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
                  We declare that this estimation is made in good faith based on
                  current market rates and specifications provided. Final
                  billing will be as per actual work executed.
                </p>
              </div>
            </div> */}
          </div>
          <div>
            {/* Footer */}
            <div className="pt-8 text-center text-sm text-black space-y-2">
              <div className="flex justify-end items-end ">
                {/* <div>
                  <p className="font-semibold">Payment Info</p>
                  <p>Bank Transfer / Cash / UPI</p>
                </div> */}
                <div className="text-right">
                  <div className="h-20   flex items-end justify-center mb-1">
                    <span className="bg-white px-2 border-dashed border-black border-t">
                      Authorized Signature
                    </span>
                  </div>
                  <p className="font-bold text-center text-black">
                    Raj Printers
                  </p>
                </div>
              </div>
              <p className="text-xs bg-white pb-2 rounded">
                This is a computer generated estimation
              </p>
            </div>
            {/* Bottom Bar */}
            <div className="h-2 bg-[#0b95a9]" />
          </div>
        </div>
      </div>
      <div className="fixed bottom-8 right-8 z-10">
        <button
          className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
          onClick={downloadImage}
        >
          <Download size={20} />
          Download Image
        </button>
      </div>
    </div>
  );
};

export default PreviewEstimate;
