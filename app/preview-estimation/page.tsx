import PreviewEstimate from "@/page-modules/PreviewEstimatePage/PreviewEstimate";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreviewEstimate />
    </Suspense>
  );
};

export default page;
