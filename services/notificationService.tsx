import * as Notifications from "expo-notifications";
import { AddHabitItem } from "./DbService"
import { TIME_SLOTS } from "../utils/timeSlots";

export const scheduleHabitSlotReminders = async (habits: AddHabitItem[]) => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const grouped: Record<string, AddHabitItem[]> = {};
    for (const habit of habits) {
        if (habit.remindersOn) {
            if (!grouped[habit.reminderSlot!]) grouped[habit.reminderSlot!] = [];
            grouped[habit.reminderSlot!].push(habit);
        }
    }

    for (const slot in grouped) {
        const habitInSlot = grouped[slot];
        const time = TIME_SLOTS[slot as keyof typeof TIME_SLOTS];

        const body = habitInSlot.map(h => `- ${h.title}`).join("\n");

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `Habit Reminder (${slot})`,
                body: body,
            },
            trigger: {
                type: 'calendar',
                hour: time.hour,
                minute: time.minute,
                repeats: true,
            } as Notifications.CalendarTriggerInput,
        });
    }
}