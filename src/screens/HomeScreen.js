// HomeScreen.js
import { Auth } from 'aws-amplify';
import React from 'react';
import { View, Text } from 'react-native';
import { DataTable,TextInput } from 'react-native-paper';
function HomeScreen() {
  const signOut = async () => {
    try {
      await Auth.signOut({ global: true });
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };
  return (
    <SafeAreaView>
      <Text>Home Screen</Text>
      <Pressable style={styles.button} onPress={() => signOut()}>
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>
    </SafeAreaView>
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
  },
});
export default HomeScreen;
