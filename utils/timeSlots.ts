export type TimeSlot = "morning" | "afternoon" | "evening";

export const TIME_SLOTS: Record<TimeSlot, { hour: number; minute: number }> = {
    morning: { hour: 9, minute: 0 },
    afternoon: { hour: 13, minute: 0 },
    evening: { hour: 19, minute: 0 },
};