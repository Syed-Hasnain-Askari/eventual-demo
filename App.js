import 'react-native-gesture-handler';
import { withAuthenticator } from '@aws-amplify/ui-react-native';
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import your screens here
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RecordScreen from './src/screens/RecordScreen';
import ContactScreen from './src/screens/ContactScreen';

import { PaperProvider } from 'react-native-paper';

import { Amplify } from 'aws-amplify';
import awsExports from './src/aws-exports';
import { Pressable, StyleSheet, Text } from 'react-native';
Amplify.configure(awsExports);
const Tab = createBottomTabNavigator();
function App() {
  return (
  <PaperProvider>
      <NavigationContainer>
      <Tab.Navigator screenOptions={{
        headerShown:true,
      }}>
        <Tab.Screen name="Home" component={HomeScreen} options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
          title: "Hub",
        }} />
        <Tab.Screen name="Plans" component={ProfileScreen} options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="newspaper" size={24} color="black" />
          ),
          title: "Plans",
        }}  />
        <Tab.Screen name="Records" component={RecordScreen}  options={{
          tabBarIcon: ({ color }) => (
            <Octicons name="checklist" size={24} color="black" />
          ),
          title: "Records",
        }} />
        <Tab.Screen name="Contacts" component={ContactScreen} options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="contacts" size={24} color="black" />
          ),
          title: "Contacts",
        }} />
      </Tab.Navigator>
     
    </NavigationContainer>
  </PaperProvider>
  );
}
const styles = StyleSheet.create({

  button: {
    marginTop: 50,
    backgroundColor: '#B00020',
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  }
});

export default withAuthenticator(App)