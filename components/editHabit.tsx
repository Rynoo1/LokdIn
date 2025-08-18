import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Text, TextInput } from 'react-native-paper'

const EditHabit = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text variant='headlineMedium'>EditHabit</Text>
      <TextInput mode='outlined' label="email" value='email' />
      <TextInput mode='outlined' label="notemail" value='email' />
    </View>
  )
}

export default EditHabit

const styles = StyleSheet.create({})