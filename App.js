import 'react-native-gesture-handler';
import { FontAwesome } from "@expo/vector-icons";
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import your screens here
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RecordScreen from './src/screens/RecordScreen';
import ContactScreen from './src/screens/ContactScreen';

import { Amplify } from 'aws-amplify';
import awsExports from './src/aws-exports';
Amplify.configure(awsExports);

const Tab = createBottomTabNavigator();

function App() {
  return (
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
            <FontAwesome name="home" size={24} color={color} />
          ),
          title: "Plans",
        }}  />
        <Tab.Screen name="Records" component={RecordScreen}  options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
          title: "Records",
        }} />
        <Tab.Screen name="Contacts" component={ContactScreen} options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
          title: "Contacts",
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
