import { supabase } from "@/lib/supabase";
import InvoicePage from "@/page-modules/Invoice/InvoicePage/InvoicePage";

const page = async () => {
  const { data: invoice } = await supabase
    .from("invoice")
    .select("*")
    .order("created_at", { ascending: false });
  return <InvoicePage invoice={invoice || []} />;
};

export default page;
