import sg001 from "@/assets/products/sg-001.jpg";
import sg002 from "@/assets/products/sg-002.jpg";
import sg003 from "@/assets/products/sg-003.jpg";
import sg004 from "@/assets/products/sg-004.jpg";
import sg005 from "@/assets/products/sg-005.jpg";
import sg006 from "@/assets/products/sg-006.jpg";
import sg007 from "@/assets/products/sg-007.jpg";
import sg008 from "@/assets/products/sg-008.jpg";

export const productImages: Record<string, string> = {
  "sg-001": sg001,
  "sg-002": sg002,
  "sg-003": sg003,
  "sg-004": sg004,
  "sg-005": sg005,
  "sg-006": sg006,
  "sg-007": sg007,
  "sg-008": sg008,
};

export const getProductImage = (productId: string): string => {
  return productImages[productId] || "/placeholder.svg";
};
