import { StyleSheet,View } from 'react-native'
import { Modal,Portal,Text,TextInput,Button } from 'react-native-paper'
import React from 'react'
export default function UserModal({handleSubmit,handleOnChnage,hideModal,visible,field}) {
    const containerStyle = {backgroundColor: 'white',height:340,margin:20,padding:20, borderRadius:20};
  return (
    <View>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <View>
          <Text variant="labelLarge">Name</Text>
          <TextInput
      label="Name"
      value={field.name}
      onChangeText={(e)=>{handleOnChnage('name',e)}}
    />
          <Text variant="labelLarge">Account</Text>
          <TextInput
      label="Account"
      value={field.account}
      onChangeText={(e)=>{handleOnChnage('account',e)}}
    />
      <Text variant="labelLarge">Date</Text>
      <TextInput
      label="Date"
    />
          </View>
          <View style={{marginTop:20}}>
          <Button mode="contained" onPress={handleSubmit} style={{padding:5}}>
            SUBMIT
         </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  )
}

const styles = StyleSheet.create({})