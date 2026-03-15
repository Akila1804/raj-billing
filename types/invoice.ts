export interface Product {
  id: number;
  name: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  date: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  gst: string;
  packing: number;
  cgst_percent: number;
  sgst_percent: number;
  products: Product[];
  subTotal: number;
  cgstAmount: number;
  sgstAmount: number;
  grandTotal: number;
  created_at: string;
}
