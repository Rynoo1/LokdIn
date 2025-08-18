import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Text } from 'react-native-paper'

const HabitOverview = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text variant='headlineMedium'>HabitOverview</Text>
      
      <Text variant='titleMedium' style={{ paddingTop: 30 }}>Goal</Text>
      <Text variant='titleMedium'>Journal Count</Text>
      <Text variant='titleMedium'>Longest Streak</Text>
      <Text variant='titleMedium'>Reminders</Text>
      <Text variant='titleMedium'>Start Date</Text>
      <Text variant='titleMedium'>Title</Text>
      <Text variant='titleMedium'>End Date</Text>
    </View>
  )
}

export default HabitOverview

const styles = StyleSheet.create({})