import AsyncStorage from '@react-native-async-storage/async-storage';
import { AttendedEvent, VerifiedEvent } from '@/types';

const ATTENDED_EVENTS_KEY = 'attended_events';
const VERIFIED_EVENTS_KEY = 'verified_events';

export const attendedEventsStorage = {
  async getAll(): Promise<AttendedEvent[]> {
    const raw = await AsyncStorage.getItem(ATTENDED_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async add(event: AttendedEvent): Promise<void> {
    const existing = await this.getAll();
    const filtered = existing.filter((e) => e.eventId !== event.eventId);
    filtered.unshift(event);
    await AsyncStorage.setItem(ATTENDED_EVENTS_KEY, JSON.stringify(filtered));
  },

  async remove(eventId: string): Promise<void> {
    const existing = await this.getAll();
    const filtered = existing.filter((e) => e.eventId !== eventId);
    await AsyncStorage.setItem(ATTENDED_EVENTS_KEY, JSON.stringify(filtered));
  },
};

export const verifiedEventsStorage = {
  async getAll(): Promise<VerifiedEvent[]> {
    const raw = await AsyncStorage.getItem(VERIFIED_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async add(event: VerifiedEvent): Promise<void> {
    const existing = await this.getAll();
    const filtered = existing.filter((e) => e.eventId !== event.eventId);
    filtered.unshift(event);
    await AsyncStorage.setItem(VERIFIED_EVENTS_KEY, JSON.stringify(filtered));
  },
};
