import { addDoc, collection, doc, getDoc, getDocs, increment, query, Timestamp, updateDoc, where } from "firebase/firestore"
import { db } from "../firebase"
import { ExtendedHabitInfo, HabitStreakInfo } from "../types/habit"
import { scheduleHabitSlotReminders } from "./notificationService";

export interface HabitItem {
    id?: string,
    title?: string,
    goal?: number,
    reminders?: boolean,
    reminderSlot?: "morning" | "afternoon" | "evening",
    currentDate?: Timestamp,
    endDate?: Timestamp,
    currentStreak?: number,
    longestStreak?: number,
    completed?: boolean,
    completion?: number,
}

export interface AddHabitItem {
    title: string,
    goal: number,
    remindersOn: boolean,
    reminderSlot?: "morning" | "afternoon" | "evening",
    startDate: Timestamp,
    currentStreak: number,
    longestStreak: number,
    completed: boolean,
    dateLastStreak: Timestamp,
    journalCount: number
}

export interface ReminderItem {
    title: string,
    time: Timestamp,
    repeatPattern: "daily" | "weekly" | "custom" | "once",
    dayOfWeek?: string[],
}

export interface UserStreakData {
    currentStreak: number;
    dataLastStreak: Timestamp;
}

// function to create new habit
export const createHabit = async (userId: string, habit: AddHabitItem) => {
    try {
        const docRef = await addDoc(collection(db, "users", userId, "habits"), habit);
        console.log("Habit added ", docRef.id);
        const allHabits = await getUserHabits(userId);
        await scheduleHabitSlotReminders(allHabits);
        return true;
    } catch (error) {
        console.log("Error ", error)
        return false;
    }
}

// function to add custom reminders
export const addReminders = async (userId: string, habitId: string, reminder: ReminderItem) => {

    const habitDoc = doc(db, "users", userId, "habits", habitId);
    await updateDoc(habitDoc, {reminders: true});
    
    try {
        const reminderRef = collection(habitDoc, "reminders");
        const q = query(
            reminderRef,
            where("time", "==", reminder.time),
            where("repeatPattern", "==", reminder.repeatPattern)
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            console.log("Reminder already exists");
            return;
        } else {
            const reminderDoc = await addDoc(reminderRef, reminder);
            console.log("Updated reminders ", reminderDoc.id);
        }
    } catch (error) {
        console.log("Error ", error);
    }
}

// get all journal entries for a specific habit
export const getHabitJournals = async (userId: string, habitId: string) => {
    try {
        const journalsRef = collection(db, "users", userId, "habits", habitId, "journals");
        const snapshot = await getDocs(journalsRef);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching journals: ", error);
        throw error;
    }
}

// get habit title, streak goal and currentstreak for all habits for one user
export const getAllHabitStreak = async (userId: string): Promise<ExtendedHabitInfo[]> => {
    try {
        const ref = collection(db, "users", userId, "habits"); 
        const snapshot = await getDocs(ref);

        const habits = snapshot.docs.map(doc => {
            const data = doc.data();
            const { currentStreak = 0, goal } = data;
            const completion = currentStreak / goal;
            return {
                id: doc.id as string,
                title: data.title as string,
                goal: data.goal as number,
                currentStreak: data.currentStreak as number,
                completion: completion,
                lastCompleted: data.dateLastStreak,
                journalCount: data.journalCount,
                completed: data.completed,
                longestStreak: data.longestStreak,
                reminders: data.remindersOn,
                reminderSlot: data.reminderSlot,
            };
        });

        return habits;

    } catch (error) { 
        console.log("Error getting all tasks streak info: ", error);
        return [];
    }
}

// get user Habits
export const getUserHabits = async (userId: string): Promise<AddHabitItem[]> => {
    const userRef = collection(db, "users", userId, "habits");
    const habitsSnap = await getDocs(userRef);

    const notifs =  habitsSnap.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
        } as AddHabitItem;
    })
    .filter(habit => habit.remindersOn === true);

    return notifs;
}

// get streak data and convert to %
export const getStreak = async (userId: string, habitId: string): Promise<HabitItem> => {
    const streakRef = doc(db, "users", userId, "habits", habitId);
    const streakSnap = await getDoc(streakRef);

    if (!streakSnap.exists()) {
        throw new Error("Habit not found");
    }

    const streakData = streakSnap.data();
    const { currentStreak = 0, goal } = streakData

    const completion = currentStreak / goal;

    const habitItem: HabitItem = {
        title: streakData.title,
        goal: streakData.goal,
        reminders: streakData.remindersOn,
        reminderSlot: streakData.reminderSlot,
        completion: completion
    };

    return habitItem;
}

// edit habit data
export const editHabitData = async (userId: string, habitItem: HabitItem) => {
    const habitRef = doc(db, "users", userId, "habits", habitItem.id!);
    const refSnap = await getDoc(habitRef);

    if (!refSnap.exists()) {
        throw new Error('Habit doc not found - ensure all data is passed!');
    }

    try {
        await updateDoc(habitRef, {
            title: habitItem.title,
            goal: habitItem.goal,
            remindersOn: habitItem.reminders,
            reminderSlot: habitItem.reminderSlot
        });
        const allHabits = await getUserHabits(userId);
        await scheduleHabitSlotReminders(allHabits);
        return true
    } catch (error) {
        console.log('Error ', error);
        return false
    }
}

// check if when last streak has been incremented and either update or reset streak
export const checkAndIncrementStreak = async (userId: string, habitId: string) => {
    const streakRef = doc(db, "users", userId, "habits", habitId);
    const streakSnap = await getDoc(streakRef);
    
    if (!streakSnap.exists()) {
        throw new Error('Habit doc not found');
    }

    const streakData = streakSnap.data();
    const { currentStreak = 0, dateLastStreak, longestStreak, completed, goal } = streakData;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastStreakDate = dateLastStreak.toDate();
    lastStreakDate.setHours(0, 0, 0, 0);

    const daysDifference = Math.floor((today.getTime() - lastStreakDate.getTime()) / (1000 * 60 * 60 * 24));

    const newStreak = currentStreak + 1;

    if (completed) {
        return {
            streakIncremented: false,
            currentStreak: 0,
            message: "Habit already completed"
        };
    }


    if (daysDifference === 0) {
        return {
            streakIncremented: false,
            currentStreak,
            message: "Streak already incremented today"
        };
    } else if (newStreak >= goal && currentStreak >= longestStreak) {
        await updateDoc(streakRef, {
            currentStreak: newStreak,
            dateLastStreak: Timestamp.fromDate(new Date()),
            longestStreak: newStreak,
            completed: true,
        });
        return {
            streakIncremented: true,
            currentStreak: newStreak,
            message: 'Habit Completed! Congratulations!'
        }
    } else if (newStreak >= goal) {
        await updateDoc(streakRef, {
            currentStreak: newStreak,
            dateLastStreak: Timestamp.fromDate(new Date()),
            completed: true,
        });
        return {
            streakIncremented: true,
            currentStreak: newStreak,
            message: 'Habit Completed! Congratulations!'
        }
    } else if (daysDifference === 1 && currentStreak >= longestStreak ) {
        await updateDoc(streakRef, {
            currentStreak: newStreak,
            dateLastStreak: Timestamp.fromDate(new Date()),
            longestStreak: newStreak
        });
        return {
            streakIncremented: true,
            currentStreak: newStreak,
            message: `Streak is now ${newStreak} days!`
        };
    } else if (daysDifference === 1) {
        await updateDoc(streakRef, {
            currentStreak: newStreak,
            dateLastStreak: Timestamp.fromDate(new Date())
        });
        return {
            streakIncremented: true,
            currentStreak: newStreak,
            message: `Streak is now ${newStreak} days!`
        };
    } else {
        await updateDoc(streakRef, {
            currentStreak: 1,
            dateLastStreak: Timestamp.fromDate(new Date())
        });
        return {
            streakIncremented: true,
            currentStreak: 1,
            message: "Streak broken! Starting fresh at day 1"
        };
    }
};

//TODO: function to mark it as complete (both manully triggered and automatically -- there could be a prompt once completed to ask the user if they want to extend the goal or mark it as complete)