import { supabase } from "@/lib/supabase";

export const generateVocherNumber = async () => {
  const { data, error } = await supabase
    .from("voucher")
    .select("voucher_id")
    .order("voucher_id", { ascending: false })
    .limit(1);

  if (error) {
    console.error(error);
    return "VOC0001";
  }

  if (!data || data.length === 0) {
    return "VOC0001";
  }

  const lastNumber = data[0].voucher_id;

  const numericPart = parseInt(lastNumber.replace("VOC", ""));
  const nextNumber = numericPart + 1;

  return `VOC${nextNumber.toString().padStart(4, "0")}`;
};
