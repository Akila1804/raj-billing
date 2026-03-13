import { supabase } from "@/lib/supabase";
import EstimationPage from "@/page-modules/EstimationPage/EstimationPage";

const page = async () => {
  const { data: estimate } = await supabase
    .from("estimate")
    .select("*")
    .order("created_at", { ascending: false });
  return <EstimationPage estimate={estimate ?? []} />;
};

export default page;
