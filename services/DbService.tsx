import { addDoc, collection, doc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore"
import { db } from "../firebase"

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

export const getHabitJournals= async (userId: string, habitId: string) => {
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

//TODO: function to edit the goal streak

//TODO: function to update the streak?

//TODO: function to mark it as complete (both manully triggered and automatically -- there could be a prompt once completed to ask the user if they want to extend the goal or mark it as complete)

//TODO: function to upload audio files to storage bucket