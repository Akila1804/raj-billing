import UpdateEstimate from "@/page-modules/Estimate/UpdateEstimation/UpdateEstimate";
import { Suspense } from "react";
export const dynamic = "force-dynamic";
const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdateEstimate />
    </Suspense>
  );
};

export default page;
