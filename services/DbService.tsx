import { addDoc, collection, doc, getDoc, getDocs, increment, query, Timestamp, updateDoc, where } from "firebase/firestore"
import { db } from "../firebase"
import { ExtendedHabitInfo, HabitStreakInfo } from "../types/habit"

export interface HabitItem {
    title: string,
    goal: number,
    reminders: boolean,
    currentDate: Timestamp,
    endDate: Timestamp,
    currentStreak: number,
    longestStreak: number,
    completed: boolean
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

//function to create new habit
export const createHabit = async (userId: string, habit: HabitItem) => {
    try {
        const docRef = await addDoc(collection(db, "users", userId, "habits"), habit);
        console.log("Habit added ", docRef.id);
    } catch (error) {
        console.log("Error ", error)
    }
}

//TODO: function to edit habit

//function to add custom reminders
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

//get all journal entries for a specific habit
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

//get habit title, streak goal and currentstreak for habits for one user
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
            };
        });

        return habits;

    } catch (error) { 
        console.log("Error getting all tasks streak info: ", error);
        return [];
    }
}

//TODO: function to edit the goal streak

// get streak data and convert to %
export const getStreak = async (userId: string, habitId: string) => {
    const streakRef = doc(db, "users", userId, "habits", habitId);
    const streakSnap = await getDoc(streakRef);

    if (!streakSnap.exists()) {
        throw new Error("Habit not found");
    }

    const streakData = streakSnap.data();
    const { currentStreak = 0, goal } = streakData

    const completion = currentStreak / goal;

    return completion;
}


// check if when last streak has been incremented and either update or reset streak
export const checkAndIncrementStreak = async (userId: string, habitId: string) => {
    const streakRef = doc(db, "users", userId, "habits", habitId);
    const streakSnap = await getDoc(streakRef);
    
    if (!streakSnap.exists()) {
        throw new Error('Habit doc not found');
    }

    const streakData = streakSnap.data();
    const { currentStreak = 0, dateLastStreak, longestStreak } = streakData;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log(longestStreak);

    if (!dateLastStreak) {
        await updateDoc(streakRef, {
            currentStreak: 1,
            dateLastStreak: Timestamp.fromDate(new Date())
        });
        return {
            streakIncremented: true,
            currentStreak: 1,
            message: "Habit streak started!"
        };
    }

    const lastStreakDate = dateLastStreak.toDate();
    lastStreakDate.setHours(0, 0, 0, 0);

    const daysDifference = Math.floor((today.getTime() - lastStreakDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDifference === 0) {
        return {
            streakIncremented: false,
            currentStreak,
            message: "Streak already incremented today"
        };
    } else if (daysDifference === 1 && currentStreak > longestStreak ) {
        const newStreak = currentStreak + 1;
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
        const newStreak = currentStreak + 1;
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