import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formData } = body;

    // Insert product into Supabase table
    const { error: insertError } = await supabase.from("voucher").insert([
      {
        customer_no: formData.customer_no,
        voucher_id: formData.voucher_id,
        date: formData.date,
        product: formData.products,
        description: formData.description,
        debit: formData.debit,
        credit: formData.credit,
        balance: formData.balance,
      },
    ]);

    if (insertError) throw insertError;

    return NextResponse.json(
      { message: "Voucher Added successfully", success: true },
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
    const customer_no = searchParams.get("customer_no");

    let query = supabase.from("voucher").select("*");

    // 🎯 Filter by voucher_id
    if (id) {
      query = query.eq("voucher_id", id);
    }

    // 🎯 Filter by customer_no
    if (customer_no) {
      query = query.eq("customer_no", customer_no);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch voucher" },
        { status: 500 },
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch voucher" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { formData, voucher_id } = body;

    if (!voucher_id) {
      return NextResponse.json(
        { error: "Voucher ID is required" },
        { status: 400 },
      );
    }

    const updateData = {
      date: formData.date,
      product: formData.products,
      description: formData.description,
      debit: formData.debit,
      credit: formData.credit,
      balance: formData.balance,
    };

    const { error } = await supabase
      .from("voucher")
      .update(updateData)
      .eq("voucher_id", voucher_id);

    if (error) throw error;

    return NextResponse.json(
      { message: "Voucher updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { error: "Failed to update Voucher" },
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
