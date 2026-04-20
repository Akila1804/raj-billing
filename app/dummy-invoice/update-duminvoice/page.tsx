import UpdateDummyInvoice from "@/page-modules/DummyInvoice/UpdateDummyInvoice/UpdateInvoice";
import { Suspense } from "react";
export const dynamic = "force-dynamic";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdateDummyInvoice />
    </Suspense>
  );
};

export default page;
