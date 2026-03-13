import UpdateEstimate from "@/page-modules/UpdateEstimation/UpdateEstimate";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdateEstimate />
    </Suspense>
  );
};

export default page;
