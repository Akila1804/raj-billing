import { supabase } from "@/lib/supabase";

export const generateCustomerNumber = async () => {
  const { data, error } = await supabase
    .from("member")
    .select("customer_no")
    .order("customer_no", { ascending: false })
    .limit(1);
  console.log("lastNumber", data);

  if (error) {
    console.error(error);
    return "MBR0001";
  }

  if (!data || data.length === 0) {
    return "MBR0001";
  }

  const lastNumber = data[0].customer_no;

  const numericPart = parseInt(lastNumber.replace("MBR", ""));
  const nextNumber = numericPart + 1;

  return `MBR${nextNumber.toString().padStart(4, "0")}`;
};
