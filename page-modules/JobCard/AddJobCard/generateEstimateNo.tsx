import { supabase } from "@/lib/supabase";

export const generateJobNumber = async () => {
  const { data, error } = await supabase
    .from("jobdata")
    .select("jobno")
    .order("jobno", { ascending: false })
    .limit(1);

  if (error) {
    console.error(error);
    return "JOB0001";
  }

  if (!data || data.length === 0) {
    return "JOB0001";
  }

  const lastNumber = data[0].jobno;

  const numericPart = parseInt(lastNumber.replace("JOB", ""));
  const nextNumber = numericPart + 1;

  return `JOB${nextNumber.toString().padStart(4, "0")}`;
};
