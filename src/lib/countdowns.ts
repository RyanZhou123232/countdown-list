import AsyncStorage from '@react-native-async-storage/async-storage';

export type Countdown = { id: string; name: string; date: string };

const storageKey = 'countdown-list.events.v1';
const millisecondsPerDay = 86_400_000;

export function localDateKey(date = new Date()) {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isDateKey(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function daysUntil(date: string, today = localDateKey()) {
  return (Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`))
    / millisecondsPerDay;
}

export function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function isCountdown(value: unknown): value is Countdown {
  if (typeof value !== 'object' || value === null) return false;
  return 'id' in value && typeof value.id === 'string'
    && 'name' in value && typeof value.name === 'string'
    && 'date' in value && typeof value.date === 'string' && isDateKey(value.date);
}

export async function loadCountdowns(): Promise<Countdown[]> {
  const raw = await AsyncStorage.getItem(storageKey);
  const data: unknown = raw === null ? [] : JSON.parse(raw);
  if (!Array.isArray(data) || !data.every(isCountdown)) {
    throw new Error('Invalid countdown data');
  }
  return data;
}

export async function saveCountdown(name: string, date: string) {
  const entries = await loadCountdowns();
  const id = Date.now().toString(36);
  let uniqueId = id;
  let suffix = 1;
  while (entries.some((entry) => entry.id === uniqueId)) {
    uniqueId = `${id}-${suffix++}`;
  }
  await AsyncStorage.setItem(storageKey, JSON.stringify([{ id: uniqueId, name, date }, ...entries]));
}
