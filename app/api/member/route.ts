import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formData } = body;

    // Insert product into Supabase table
    const { error: insertError } = await supabase.from("member").insert([
      {
        customer_no: formData.customer_no,
        customer_name: formData.customer_name,
        phone: formData.phone,
        address: formData.address,
        gst: formData.gst,
      },
    ]);

    if (insertError) throw insertError;

    return NextResponse.json(
      { message: "Members Added successfully", success: true },
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
        .from("member")
        .select("*")
        .eq("customer_no", id)
        .single());
    } else {
      ({ data, error } = await supabase.from("member").select("*"));
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
    const { formData, customer_no } = body;

    if (!customer_no) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 },
      );
    }

    const updateData = {
      customer_name: formData.customer_name,
      phone: formData.phone,
      address: formData.address,
      gst: formData.gst,
    };

    const { error } = await supabase
      .from("member")
      .update(updateData)
      .eq("customer_no", customer_no);

    if (error) throw error;

    return NextResponse.json(
      { message: "Member updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { error: "Failed to update Member" },
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
