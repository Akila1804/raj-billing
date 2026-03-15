import UpdateInvoice from "@/page-modules/Invoice/UpdateInvoice/UpdateInvoice";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdateInvoice />
    </Suspense>
  );
};

export default page;
