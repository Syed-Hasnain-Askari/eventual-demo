// HomeScreen.js
import React from 'react';
import { View, Text } from 'react-native';
import { DataTable,TextInput } from 'react-native-paper';
function HomeScreen() {
  return (
    <View>
            <TextInput
      label="Password"
      secureTextEntry
      mode='outlined'
      right={<TextInput.Icon icon="eye" />}
    />
    </View>
  );
}
export default HomeScreen;
