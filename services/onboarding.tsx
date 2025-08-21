import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "hasOnboarded";

export const setOnboarded = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
};

export const checkOnboarded = async (): Promise<boolean> => {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === "true";
};