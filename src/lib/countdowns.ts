import AsyncStorage from '@react-native-async-storage/async-storage';

export type Countdown = { id: string; name: string; date: string };

const storageKey = 'countdown-list.events.v1';
const recoveryKey = 'countdown-list.events.v1.recovery';
const millisecondsPerDay = 86_400_000;

let pendingWrite = Promise.resolve();

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

function decodeCountdowns(raw: string | null): { entries: Countdown[]; recovered: boolean } {
  if (raw === null) return { entries: [], recovered: false };

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { entries: [], recovered: true };
  }
  if (!Array.isArray(data)) return { entries: [], recovered: true };

  const entries = data.filter(isCountdown);
  return { entries, recovered: entries.length !== data.length };
}

export async function loadCountdowns() {
  await pendingWrite;
  return decodeCountdowns(await AsyncStorage.getItem(storageKey));
}

export function saveCountdown(name: string, date: string) {
  // Serialize each read-modify-write so a second save sees the first one's changes.
  const write = pendingWrite.then(async () => {
    const raw = await AsyncStorage.getItem(storageKey);
    const { entries, recovered } = decodeCountdowns(raw);
    if (recovered && raw !== null) {
      await AsyncStorage.setItem(recoveryKey, raw);
    }

    const id = Date.now().toString(36);
    let uniqueId = id;
    let suffix = 1;
    while (entries.some((entry) => entry.id === uniqueId)) {
      uniqueId = `${id}-${suffix++}`;
    }
    await AsyncStorage.setItem(storageKey, JSON.stringify([{ id: uniqueId, name, date }, ...entries]));
  });

  // Keep later operations available even if this caller's save fails.
  pendingWrite = write.catch(() => {});
  return write;
}
