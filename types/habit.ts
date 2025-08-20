import { Timestamp } from "firebase/firestore";
import { TimeSlot } from "../utils/timeSlots";

export type HabitStreakInfo = {
    id: string;
    title: string;
    goal: number;
    currentStreak: number;
    completion: number;
    lastCompleted: Timestamp;
}

export type ExtendedHabitInfo = HabitStreakInfo & {
    journalCount: number;
    completed: boolean;
    longestStreak: number;
    reminders: boolean;
    reminderSlot: TimeSlot;
}