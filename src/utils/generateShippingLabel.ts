import type { ShopIdentity } from "@/hooks/useSiteSettings";

interface ShippingLabelData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: {
    line1?: string;
    address_line1?: string;
    line2?: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: { name: string; quantity: number }[];
  shopIdentity?: ShopIdentity;
}

const DEFAULT_BRAND = {
  name: "KALAI FASHIONS",
  line1: "Elampillai",
  city: "Salem",
  state: "Tamil Nadu",
  pincode: "637502",
  phone: "+91 88702 26867",
};

export function generateShippingLabel(data: ShippingLabelData) {
  const s = data.shopIdentity;
  const brand = {
    name: s?.shop_name?.toUpperCase() ?? DEFAULT_BRAND.name,
    line1: s?.address_line1 ?? DEFAULT_BRAND.line1,
    city: s?.city ?? DEFAULT_BRAND.city,
    state: s?.state ?? DEFAULT_BRAND.state,
    pincode: s?.pincode ?? DEFAULT_BRAND.pincode,
    phone: s?.phone ?? DEFAULT_BRAND.phone,
  };

  const addr = data.address;
  const toLine1 = addr.line1 || addr.address_line1 || "";
  const toLine2 = addr.line2 || addr.address_line2 || "";

  const itemsList = data.items
    .map((i) => `<span style="display:block;font-size:9px;color:#444;">${i.name} × ${i.quantity}</span>`)
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <title>Shipping Label - ${data.orderNumber}</title>
      <style>
        @page { size: 6in 4in; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { width: 6in; height: 4in; font-family: 'Arial', sans-serif; padding: 12px; display: flex; flex-direction: column; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 8px; }
        .brand { font-size: 14px; font-weight: 900; letter-spacing: 1px; }
        .order-id { font-size: 11px; font-weight: 700; }
        .section { margin-bottom: 8px; }
        .label { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #888; font-weight: 700; margin-bottom: 2px; }
        .name { font-size: 13px; font-weight: 700; }
        .addr { font-size: 11px; line-height: 1.4; }
        .phone { font-size: 10px; color: #555; }
        .divider { border-top: 1px dashed #aaa; margin: 6px 0; }
        .from-section { background: #f5f5f5; padding: 6px 8px; border-radius: 4px; }
        .items { font-size: 9px; margin-top: 4px; color: #444; }
        .flex-row { display: flex; gap: 16px; }
        .flex-1 { flex: 1; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">${brand.name}</div>
        <div class="order-id">${data.orderNumber}</div>
      </div>

      <div class="flex-row" style="flex:1;">
        <div class="flex-1">
          <div class="section">
            <div class="label">To</div>
            <div class="name">${data.customerName}</div>
            <div class="addr">
              ${toLine1}${toLine2 ? "<br/>" + toLine2 : ""}
              <br/>${addr.city}, ${addr.state}
              <br/><strong>${addr.pincode}</strong>
            </div>
            <div class="phone">${data.customerPhone}</div>
          </div>

          <div class="divider"></div>

          <div class="from-section">
            <div class="label">From</div>
            <div style="font-size:11px;font-weight:700;">${brand.name}</div>
            <div class="addr">
              ${brand.line1}<br/>
              ${brand.city}, ${brand.state} - ${brand.pincode}
            </div>
            <div class="phone">${brand.phone}</div>
          </div>
        </div>

        <div style="width:40%;">
          <div class="label">Products</div>
          <div class="items">${itemsList}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 400);
  }
}
