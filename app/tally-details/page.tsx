// import { supabase } from "@/lib/supabase";
import LedgerPage from "@/page-modules/Tally/TallyDetailPage/TallyDetailPage";

export const dynamic = "force-dynamic";
const page = async () => {
  //   const { data: members } = await supabase
  //     .from("member")
  //     .select("*")
  //     .order("created_at", { ascending: false });
  return <LedgerPage />;
};

export default page;
