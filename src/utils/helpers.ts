// use to verify a string value is not null and not empty/whitespace
export const isStringNotEmpty = (str?: string | null) => {
  return !!str && str.trim() !== "";
};
