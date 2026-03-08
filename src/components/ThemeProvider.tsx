import { useEffect } from "react";
import { useThemeColors } from "@/hooks/useSiteSettings";

function hexToHSL(hex: string): string {
  let r = 0, g = 0, b = 0;
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: colors } = useThemeColors();

  useEffect(() => {
    if (!colors) return;
    const root = document.documentElement;
    const primaryHSL = hexToHSL(colors.primary);
    const accentHSL = hexToHSL(colors.accent);
    const bgHSL = hexToHSL(colors.background);

    root.style.setProperty("--primary", primaryHSL);
    root.style.setProperty("--primary-foreground", bgHSL);
    root.style.setProperty("--accent", accentHSL);
    root.style.setProperty("--accent-foreground", bgHSL);
    root.style.setProperty("--foreground", primaryHSL);
    root.style.setProperty("--background", bgHSL);
    root.style.setProperty("--ring", primaryHSL);

    return () => {
      // cleanup: remove inline styles on unmount
      ["--primary", "--primary-foreground", "--accent", "--accent-foreground", "--foreground", "--background", "--ring"].forEach(
        (v) => root.style.removeProperty(v)
      );
    };
  }, [colors]);

  return <>{children}</>;
}
