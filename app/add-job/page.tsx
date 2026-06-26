import AddJobCard from "@/page-modules/JobCard/AddJobCard/AddJobCard";

export const dynamic = "force-dynamic";
const page = async () => {
  //   const { data: invoice } = await supabase
  //     .from("invoice")
  //     .select("*")
  //     .order("created_at", { ascending: false });
  return <AddJobCard />;
};

export default page;
