import { supabase } from "@/lib/supabase";

export const generateInvoiceNumber = async () => {
  const { data, error } = await supabase
    .from("invoice")
    .select("invoiceNo")
    .order("invoiceNo", { ascending: false })
    .limit(1);
  console.log("lastNumber", data);

  if (error) {
    console.error(error);
    return "INV0001";
  }

  if (!data || data.length === 0) {
    return "INV0001";
  }

  const lastNumber = data[0].invoiceNo;

  const numericPart = parseInt(lastNumber.replace("INV", ""));
  const nextNumber = numericPart + 1;

  return `INV${nextNumber.toString().padStart(4, "0")}`;
};
