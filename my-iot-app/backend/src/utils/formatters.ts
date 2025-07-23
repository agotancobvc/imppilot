// backend/src/utils/formatters.ts
export const toISO = (date: Date): string => date.toISOString();
export const toEpoch = (date: Date): number => Math.floor(date.getTime() / 1_000);
