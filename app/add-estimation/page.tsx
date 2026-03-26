import { supabase } from "@/lib/supabase";
import AddEstimation from "@/page-modules/Estimate/AddEstimation/AddEstimation";
export const dynamic = "force-dynamic";
const page = async () => {
  const { data: estimate } = await supabase
    .from("estimate")
    .select("*")
    .order("created_at", { ascending: false });
  return <AddEstimation estimate={estimate ?? []} />;
};

export default page;
