export type Lang = "en" | "az";

/** A string that exists in both supported languages. */
export interface Bi {
  en: string;
  az: string;
}

export const bi = (en: string, az: string): Bi => ({ en, az });

/** Replace `{name}` placeholders with values. Unknown placeholders are left as-is. */
export function interpolate(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = vars[key];
    return value === undefined ? match : String(value);
  });
}
