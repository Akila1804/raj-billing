import PreviewInvoice from "@/page-modules/Invoice/PreviewInvoicePage/PreviewInvoice";
import { Suspense } from "react";
export const dynamic = "force-dynamic";
const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreviewInvoice />
    </Suspense>
  );
};

export default page;
