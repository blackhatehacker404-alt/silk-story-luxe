import { formatPrice } from "@/data/products";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  orderNumber: string;
  date: string;
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
  items: InvoiceItem[];
  totalAmount: number;
  paymentStatus: string;
  paymentMethod?: string;
}

export function generateInvoicePDF(data: InvoiceData) {
  const itemRows = data.items
    .map(
      (item, i) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">${i + 1}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatPrice(item.price)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatPrice(item.price * item.quantity)}</td>
      </tr>`
    )
    .join("");

  const addr = data.address;
  const line1 = addr.line1 || addr.address_line1 || "";
  const line2 = addr.line2 || addr.address_line2 || "";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <title>Invoice ${data.orderNumber}</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 40px; color: #1a1a1a; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #1a1a1a; padding-bottom: 20px; }
        .brand { font-size: 24px; font-weight: 700; letter-spacing: 2px; }
        .brand-sub { font-size: 11px; color: #666; margin-top: 4px; }
        .invoice-title { font-size: 28px; font-weight: 300; text-align: right; }
        .invoice-number { font-size: 13px; color: #666; text-align: right; margin-top: 4px; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .meta-block h4 { margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #999; }
        .meta-block p { margin: 2px 0; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f5f5f5; padding: 10px 8px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #ddd; }
        .total-row td { font-weight: 700; font-size: 16px; border-top: 2px solid #1a1a1a; padding-top: 12px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 3px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
        .badge-paid { background: #d4edda; color: #155724; }
        .badge-pending { background: #fff3cd; color: #856404; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">KALAI FASHIONS</div>
          <div class="brand-sub">Manufactured in Elampillai</div>
        </div>
        <div>
          <div class="invoice-title">INVOICE</div>
          <div class="invoice-number">${data.orderNumber}</div>
        </div>
      </div>

      <div class="meta">
        <div class="meta-block">
          <h4>Bill To</h4>
          <p><strong>${data.customerName}</strong></p>
          <p>${data.customerPhone}</p>
          <p>${line1}${line2 ? ", " + line2 : ""}</p>
          <p>${addr.city}, ${addr.state} - ${addr.pincode}</p>
        </div>
        <div class="meta-block" style="text-align:right;">
          <h4>Invoice Date</h4>
          <p>${new Date(data.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          <h4 style="margin-top:12px;">Payment</h4>
          <p><span class="badge ${data.paymentStatus === "paid" ? "badge-paid" : "badge-pending"}">${data.paymentStatus}</span></p>
          ${data.paymentMethod ? `<p style="margin-top:4px;">${data.paymentMethod}</p>` : ""}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th style="text-align:center;">Qty</th>
            <th style="text-align:right;">Price</th>
            <th style="text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
          <tr class="total-row">
            <td colspan="4" style="padding:12px 8px;text-align:right;">Grand Total</td>
            <td style="padding:12px 8px;text-align:right;">${formatPrice(data.totalAmount)}</td>
          </tr>
        </tbody>
      </table>

      <div class="footer">
        <p>Thank you for shopping with Kalai Fashions!</p>
        <p>For any queries, contact us on WhatsApp: +91 88702 26867</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  }
}
