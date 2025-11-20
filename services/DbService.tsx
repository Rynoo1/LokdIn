import { addDoc, collection, doc, getDoc, getDocs, increment, query, Timestamp, updateDoc, where, writeBatch } from "firebase/firestore"
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
    lastCompleted: Timestamp,
    completed?: boolean,
    completion?: number,
    dateStarted?: Timestamp,
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

function toDateSafe(value: any): Date | null {
  if (!value) return null;
  // Firestore Timestamp has toDate()
  if (typeof value.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;
  // fallback: try new Date()
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
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
// export const addReminders = async (userId: string, habitId: string, reminder: ReminderItem) => {

//     const habitDoc = doc(db, "users", userId, "habits", habitId);
//     await updateDoc(habitDoc, {reminders: true});
    
//     try {
//         const reminderRef = collection(habitDoc, "reminders");
//         const q = query(
//             reminderRef,
//             where("time", "==", reminder.time),
//             where("repeatPattern", "==", reminder.repeatPattern)
//         );

//         const querySnapshot = await getDocs(q);
//         if (!querySnapshot.empty) {
//             console.log("Reminder already exists");
//             return;
//         } else {
//             const reminderDoc = await addDoc(reminderRef, reminder);
//             console.log("Updated reminders ", reminderDoc.id);
//         }
//     } catch (error) {
//         console.log("Error ", error);
//     }
// }

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

// get habit title
export const getHabitTitle = async (userId: string, habitId: string) => {
    try {
        const habbit = await getDoc(doc(db, "users", userId, "habits", habitId));
        return habbit.data(); 
    } catch (error) {
        console.error("Error fetching Habit Name: ", error);
    }
}

// get habit title, streak goal and currentstreak for all habits for one user
export const getAllHabitStreak = async (userId: string): Promise<ExtendedHabitInfo[]> => {
    try {
        const ref = collection(db, "users", userId, "habits");
        const q = query(ref, where("completed", "==", false));
        const snapshot = await getDocs(q);

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
        completion: completion,
        lastCompleted: streakData.dateLastStreak,
        dateStarted: streakData.startDate,
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
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
        console.error('Error ', error);
        return false
    }
}

export const checkStreak = async (userId: string, habitId: string) => {
    const streakRef = doc(db, "users", userId, "habits", habitId);
    const streakSnap = await getDoc(streakRef);
    
    if (!streakSnap.exists()) {
        throw new Error('Habit doc not found');
    }

    const streakData = streakSnap.data();
    const { dateLastStreak } = streakData;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastStreakDate = dateLastStreak.toDate();
    lastStreakDate.setHours(0, 0, 0, 0);

    const daysDifference = Math.floor((today.getTime() - lastStreakDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDifference > 1) {
        await updateDoc(streakRef, {
            currentStreak: 0,
        });
        return {
            streakReset: true,
            message: "Streak broken! Starting fresh at day 0"
        };
    } else {
        return {
            streakReset: false,
            message: "Streak is intact"
        };
    }
};



type CheckResult = {
  shouldReset: boolean;
  message: string;
};

export const checkStreakFromData = (docData: any): CheckResult => {
  const { dateLastStreak } = docData ?? {};

  const lastStreakDate = toDateSafe(dateLastStreak);
  if (!lastStreakDate) {
    // If there's no last date, treat as not broken (or decide differently)
    return { shouldReset: false, message: "No last date — leaving as is" };
  }

  // zero out time so we compare dates only
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  lastStreakDate.setHours(0, 0, 0, 0);

  const daysDifference = Math.floor((today.getTime() - lastStreakDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDifference > 1) {
    return { shouldReset: true, message: "Streak broken! Starting fresh at day 0" };
  } else {
    return { shouldReset: false, message: "Streak is intact" };
  }
};




// check when last the streak has been incremented and either update or reset streak
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



export const getAllHabitStreakAndFix = async (userId: string): Promise<ExtendedHabitInfo[]> => {
  try {
    const ref = collection(db, "users", userId, "habits");
    const q = query(ref, where("completed", "==", false));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    let needsCommit = false;

    const habits = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const check = checkStreakFromData(data);

      // prepare local copy for return
      const currentStreak = typeof data.currentStreak === "number" ? data.currentStreak : 0;
      const goal = typeof data.goal === "number" ? data.goal : 1;
      const completion = currentStreak / goal;

      // If broken, queue reset and update local copy
      if (check.shouldReset && currentStreak !== 0) {
        batch.update(doc(db, "users", userId, "habits", docSnap.id), { currentStreak: 0 });
        needsCommit = true;

        return {
          id: docSnap.id,
          title: data.title as string,
          goal,
          currentStreak: 0, // reflect reset
          completion: 0 / goal,
          lastCompleted: data.dateLastStreak,
          journalCount: data.journalCount,
          completed: data.completed,
          longestStreak: data.longestStreak,
          reminders: data.remindersOn,
          reminderSlot: data.reminderSlot,
        } as ExtendedHabitInfo;
      } else {
        // not reset — return as-is
        return {
          id: docSnap.id,
          title: data.title as string,
          goal,
          currentStreak,
          completion,
          lastCompleted: data.dateLastStreak,
          journalCount: data.journalCount,
          completed: data.completed,
          longestStreak: data.longestStreak,
          reminders: data.remindersOn,
          reminderSlot: data.reminderSlot,
        } as ExtendedHabitInfo;
      }
    });

    if (needsCommit) {
      // Firestore batch limit: 500. If you might exceed it, split into multiple batches.
      await batch.commit();
    }

    return habits;

  } catch (error) {
    console.error("Error getting all tasks streak info: ", error);
    return [];
  }
};





//TODO: function to mark it as complete (both manully triggered and automatically -- there could be a prompt once completed to ask the user if they want to extend the goal or mark it as complete)