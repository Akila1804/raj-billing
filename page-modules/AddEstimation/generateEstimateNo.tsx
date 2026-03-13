import { supabase } from "@/lib/supabase";

export const generateEstimationNumber = async () => {
  const { data, error } = await supabase
    .from("estimate")
    .select("estimationNo")
    .order("estimationNo", { ascending: false })
    .limit(1);
  console.log("lastNumber", data);

  if (error) {
    console.error(error);
    return "EST0001";
  }

  if (!data || data.length === 0) {
    return "EST0001";
  }

  const lastNumber = data[0].estimationNo;

  const numericPart = parseInt(lastNumber.replace("EST", ""));
  const nextNumber = numericPart + 1;

  return `EST${nextNumber.toString().padStart(4, "0")}`;
};
