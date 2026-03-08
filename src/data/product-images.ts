import sg001 from "@/assets/products/sg-001.jpg";
import sg002 from "@/assets/products/sg-002.jpg";
import sg003 from "@/assets/products/sg-003.jpg";
import sg004 from "@/assets/products/sg-004.jpg";
import sg005 from "@/assets/products/sg-005.jpg";
import sg006 from "@/assets/products/sg-006.jpg";
import sg007 from "@/assets/products/sg-007.jpg";
import sg008 from "@/assets/products/sg-008.jpg";
import mw001 from "@/assets/products/mw-001.jpg";
import mw002 from "@/assets/products/mw-002.jpg";
import mw003 from "@/assets/products/mw-003.jpg";
import mw004 from "@/assets/products/mw-004.jpg";
import mw005 from "@/assets/products/mw-005.jpg";
import mw006 from "@/assets/products/mw-006.jpg";

export const productImages: Record<string, string> = {
  "sg-001": sg001,
  "sg-002": sg002,
  "sg-003": sg003,
  "sg-004": sg004,
  "sg-005": sg005,
  "sg-006": sg006,
  "sg-007": sg007,
  "sg-008": sg008,
  "mw-001": mw001,
  "mw-002": mw002,
  "mw-003": mw003,
  "mw-004": mw004,
  "mw-005": mw005,
  "mw-006": mw006,
};

export const getProductImage = (productId: string): string => {
  return productImages[productId] || "/placeholder.svg";
};
