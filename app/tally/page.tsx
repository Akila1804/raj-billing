import { supabase } from "@/lib/supabase";
import TallyPage from "@/page-modules/Tally/TallyPage/TallyPage";

export const dynamic = "force-dynamic";
const page = async () => {
  const { data: members } = await supabase
    .from("member")
    .select("*")
    .order("created_at", { ascending: false });
  const { data: voucher } = await supabase
    .from("voucher")
    .select("*")
    .order("created_at", { ascending: false });
  return <TallyPage members={members ?? []} voucher={voucher ?? []} />;
};

export default page;
