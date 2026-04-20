import { supabase } from "@/lib/supabase";

export const generateDummyInvoiceNumber = async () => {
  const { data, error } = await supabase
    .from("dummy_invoice")
    .select("duminvoiceNo")
    .order("duminvoiceNo", { ascending: false })
    .limit(1);

  if (error) {
    console.error(error);
    return "DINV0001";
  }

  if (!data || data.length === 0) {
    return "DINV0001";
  }

  const lastNumber = data[0].duminvoiceNo;

  const numericPart = parseInt(lastNumber.replace("DINV", ""));
  const nextNumber = numericPart + 1;

  return `DINV${nextNumber.toString().padStart(4, "0")}`;
};
