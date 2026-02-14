import { SslCommerzPayment } from "sslcommerz";

const store_id = process.env.SSLCOMMERZ_STORE_ID!;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD!;
const is_live = false;

export const sslConfig = new SslCommerzPayment(store_id, store_passwd, is_live);

interface Props {
  total_amount: number;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  product_name: string;
  product_category: string;
  cus_name: string;
  cus_email: string;
  cus_add1: string;
  cus_phone: string;

  currency?: string;
  shipping_method?: string;
  product_profile?: string;

  cus_add2?: string;
  cus_city?: string;
  cus_state?: string;
  cus_postcode?: string;
  cus_country?: string;
  cus_fax?: string;

  ship_name?: string;
  ship_add1?: string;
  ship_add2?: string;
  ship_city?: string;
  ship_state?: string;
  ship_postcode?: number;
  ship_country?: string;
}

export const dataConfig = (props: Props) => ({
  ...props,
  currency: props.currency || "BDT",
  shipping_method: props.shipping_method || "Courier",
  product_profile: props.product_profile || "general",

  cus_add2: props.cus_add2 || "Dhaka",
  cus_city: props.cus_city || "Dhaka",
  cus_state: props.cus_state || "Dhaka",
  cus_postcode: props.cus_postcode || "1000",
  cus_country: props.cus_country || "Bangladesh",
  cus_fax: props.cus_fax || "000000",

  ship_name: props.ship_name || props.cus_name,
  ship_add1: props.ship_add1 || props.cus_add1,
  ship_add2: props.ship_add2 || "Dhaka",
  ship_city: props.ship_city || "Dhaka",
  ship_state: props.ship_state || "Dhaka",
  ship_postcode: props.ship_postcode || 1000,
  ship_country: props.ship_country || "Bangladesh",
});
