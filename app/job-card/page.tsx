import JobCardPage from "@/page-modules/JobCard/JobCardPage/JobCardPage";

export const dynamic = "force-dynamic";
const page = async () => {
  //   const { data: invoice } = await supabase
  //     .from("invoice")
  //     .select("*")
  //     .order("created_at", { ascending: false });
  return <JobCardPage />;
};

export default page;
