import { Timestamp } from "firebase/firestore";

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
}