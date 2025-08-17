export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

export type MainStackParamList = {
    Dashboard: undefined;
    QuickUse: undefined;
    Habit: {habitId: string};
};