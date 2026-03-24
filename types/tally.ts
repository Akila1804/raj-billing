export interface Member {
  customer_no: string;
  customer_name: string;
  phone: string;
  address: string;
  gst: string;
}

export interface Entry {
  voucher_id: string;
  customer_no: string;
  date: string;
  product: string;
  description?: string;
  debit: number;
  credit: number;
}
