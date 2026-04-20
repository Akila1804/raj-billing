import PreviewDummyInvoice from "@/page-modules/DummyInvoice/PreviewDummyInvoicePage/PreviewDummyInvoice";
import { Suspense } from "react";
export const dynamic = "force-dynamic";
const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreviewDummyInvoice />
    </Suspense>
  );
};

export default page;
