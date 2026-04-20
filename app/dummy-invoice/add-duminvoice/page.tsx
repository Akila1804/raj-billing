import { supabase } from "@/lib/supabase";
import AddDummyInvoice from "@/page-modules/DummyInvoice/AddDummyInvoice/AddDummyInvoice";
export const dynamic = "force-dynamic";

const page = async () => {
  const { data: invoice } = await supabase
    .from("dummy_invoice")
    .select("*")
    .order("created_at", { ascending: false });
  return <AddDummyInvoice invoice={invoice || []} />;
};

export default page;
