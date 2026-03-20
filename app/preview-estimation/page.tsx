import PreviewEstimate from "@/page-modules/Estimate/PreviewEstimatePage/PreviewEstimate";
import { Suspense } from "react";
export const dynamic = "force-dynamic";
const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreviewEstimate />
    </Suspense>
  );
};

export default page;
