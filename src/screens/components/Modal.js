import { StyleSheet,View } from 'react-native'
import { Modal,Portal,Text,TextInput,Button,IconButton } from 'react-native-paper'
import React from 'react'
export default function UserModal({handleSubmit,handleOnChnage,handleSubmitUpdate,hideModal,visible,field}) {
  const containerStyle = {backgroundColor: 'white',height:320,margin:20,padding:20, borderRadius:20};
  console.log(field,"field")
  return (
    <View>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <View style={{display:"flex",flexDirection:'row',justifyContent:"flex-end"}}>
          <IconButton
        icon="close"
        size={30}
        onPress={hideModal}
      />
          </View>
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