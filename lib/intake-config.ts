export const californiaConfig = {
  state: "California",
  filingFee: 120,
  waiverAvailable: true,
} as const;

export const serviceFees = {
  Expungement: 249,
  "Record Sealing": 249,
  "Felony Reduction (17(b))": 149,
  "Early Termination of Probation": 149,
} as const;

export type ServiceType = keyof typeof serviceFees;

export const californiaCounties = [
  "Alameda", "Alpine", "Amador", "Butte", "Calaveras", "Colusa", "Contra Costa",
  "Del Norte", "El Dorado", "Fresno", "Glenn", "Humboldt", "Imperial", "Inyo",
  "Kern", "Kings", "Lake", "Lassen", "Los Angeles", "Madera", "Marin", "Mariposa",
  "Mendocino", "Merced", "Modoc", "Mono", "Monterey", "Napa", "Nevada", "Orange",
  "Placer", "Plumas", "Riverside", "Sacramento", "San Benito", "San Bernardino",
  "San Diego", "San Francisco", "San Joaquin", "San Luis Obispo", "San Mateo",
  "Santa Barbara", "Santa Clara", "Santa Cruz", "Shasta", "Sierra", "Siskiyou",
  "Solano", "Sonoma", "Stanislaus", "Sutter", "Tehama", "Trinity", "Tulare",
  "Tuolumne", "Ventura", "Yolo", "Yuba",
] as const;

export function isAdultDateOfBirth(value: string, now = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const dob = new Date(Date.UTC(year, month - 1, day));
  if (
    dob.getUTCFullYear() !== year ||
    dob.getUTCMonth() !== month - 1 ||
    dob.getUTCDate() !== day
  ) {
    return false;
  }

  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  if (dob.getTime() > today) return false;

  let age = now.getUTCFullYear() - year;
  if (
    now.getUTCMonth() < month - 1 ||
    (now.getUTCMonth() === month - 1 && now.getUTCDate() < day)
  ) {
    age -= 1;
  }
  return age >= 18;
}
