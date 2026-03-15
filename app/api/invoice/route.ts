import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { form, products, totals } = body;

    // Insert product into Supabase table
    const { error: insertError } = await supabase.from("invoice").insert([
      {
        invoiceNo: form.invoiceNo,
        date: form.date,
        customerName: form.customerName,
        phone: form.phone,
        city: form.city,
        address: form.address,
        gst: form.gst,
        packing: form.packing,
        cgst_percent: form.cgst,
        sgst_percent: form.sgst,
        products: products,
        subTotal: totals.subTotal,
        cgstAmount: totals.cgstAmount,
        sgstAmount: totals.sgstAmount,
        grandTotal: totals.grandTotal,
      },
    ]);

    if (insertError) throw insertError;

    return NextResponse.json(
      { message: "Invoice saved successfully", success: true },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // if (!id) {
    //   return NextResponse.json(
    //     { error: "Product ID is required" },
    //     { status: 400 }
    //   );
    // }
    let data, error;
    if (id) {
      ({ data, error } = await supabase
        .from("invoice")
        .select("*")
        .eq("invoiceNo", id)
        .single());
    } else {
      ({ data, error } = await supabase.from("invoice").select("*"));
    }
    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch invoice" },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Invoice" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, form, products, totals } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 },
      );
    }

    const updateData = {
      customerName: form.customerName,
      phone: form.phone,
      city: form.city,
      address: form.address,
      gst: form.gst,
      packing: form.packing,
      date: form.date,
      products: products,
      cgst_percent: form.cgst,
      sgst_percent: form.sgst,
      subTotal: totals.subTotal,
      cgstAmount: totals.cgstAmount,
      sgstAmount: totals.sgstAmount,
      grandTotal: totals.grandTotal,
    };

    const { error } = await supabase
      .from("invoice")
      .update(updateData)
      .eq("invoiceNo", id);

    if (error) throw error;

    return NextResponse.json(
      { message: "Invoice updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { error: "Failed to update Invoice" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("invoice").delete().eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to delete Invoice" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Invoice deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete Invoice" },
      { status: 500 },
    );
  }
}
