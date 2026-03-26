import AddInvoice from "@/page-modules/Invoice/AddInvoice/AddInvoice";
import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";

const page = async () => {
  const { data: invoice } = await supabase
    .from("invoice")
    .select("*")
    .order("created_at", { ascending: false });
  return <AddInvoice invoice={invoice || []} />;
};

export default page;
