export const serializeJsonLd = (value: unknown): string =>
  JSON.stringify(value).replaceAll("<", "\\u003c");
