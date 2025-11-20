import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ExtendedHabitInfo } from '../types/habit';
import { useAuth } from '../contexts/authContext';
import { Text } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MainStackParamList } from '../types/navigation';

const AllHabits = ({ habitData, refreshing, onRefresh }: { habitData: ExtendedHabitInfo[]; refreshing: boolean; onRefresh: () => void }) => {

    const { user } = useAuth();
    const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  return (
    <View>
        <View style={styles.container}>
            <Text variant='titleLarge' style={styles.titles}> Habit </Text>
            <Text variant='titleLarge' style={styles.titles}> Goal </Text>
            <Text variant='titleLarge' style={styles.titles}> Current </Text>
            <Text variant='titleLarge' style={styles.titles}> Longest </Text>
            <Text variant='titleLarge' style={styles.titles}> Journals </Text>
            <Text variant='titleLarge' style={[styles.titles, {borderRightColor: '#011F26'}]}> Reminders </Text>
        </View>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {(habitData.length === 0) ? (
            <View style={{padding: 16, borderRadius: 8, alignItems: 'center',}}>
                <View>
                    <Text variant='titleLarge' style={{textAlign: 'center'}}>No habits yet</Text>
                    <Text variant='titleLarge' style={{textAlign: 'center'}}>Pull down to refresh</Text>
                </View>
            </View>
        ) : (
            habitData.map((item) => (
                <View
                    key={item.id}
                    style={{
                        padding: 16,
                        borderRadius: 8,
                    }}
                >
                    <View>
                        <TouchableOpacity style={styles.content} onPress={() => navigation.navigate("Habit", { habitId: `${item.id}` })}>
                            <Text variant='titleLarge' style={styles.label}>{item.title}</Text>
                            <Text variant='titleLarge' style={styles.items}>{item.goal}</Text>
                            <Text variant='titleLarge' style={styles.items}>{item.currentStreak}</Text>
                            <Text variant='titleLarge' style={styles.items}>{item.longestStreak}</Text>
                            <Text variant='titleLarge' style={styles.items}>{item.journalCount}</Text>
                            <Text variant='titleLarge' style={styles.items}>{item.reminders ? item.reminderSlot.charAt(0).toUpperCase() + item.reminderSlot.slice(1) : "Off"}</Text>
                        </TouchableOpacity>

                    </View>

                </View>
            ))
        )}
        </ScrollView>
    </View>
  )
}

export default AllHabits

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingVertical: 8,
        borderBottomWidth: 4,
        borderColor: '#F2668B',
        backgroundColor: '#011F26'
    },
    content: {
        flexDirection: "row",
        paddingVertical: 8,
    },
    titles: {
        flex: 1,
        textAlign: 'center',
        color: "#e7effaff",
        borderRightColor: '#F2668B',
        borderRightWidth: 2
    },
    label: {
        color: "#026873",
        flex: 1,
    },
    items: {
        color: "#03A688",
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    heading: {
        textAlign: 'center', 
        marginBottom: 10, 
        marginTop: 15,
        color: '#011F26'
    }
})