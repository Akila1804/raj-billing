import { supabase } from "@/lib/supabase";
import DummyInvoicePage from "@/page-modules/DummyInvoice/DummyInvoicePage/DummyInvoicePage";
export const dynamic = "force-dynamic";
const page = async () => {
  const { data: invoice } = await supabase
    .from("dummy_invoice")
    .select("*")
    .order("created_at", { ascending: false });
  return <DummyInvoicePage invoice={invoice || []} />;
};

export default page;
