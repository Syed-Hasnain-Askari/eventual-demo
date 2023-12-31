import { StyleSheet,View } from 'react-native'
import { Modal,Portal,Text,TextInput,Button,IconButton } from 'react-native-paper'
import React from 'react'
export default function UpdateModal({handleOnChnage,handleSubmitUpdate,hideUpdateModal,visibleUpdate,field}) {
  const containerStyle = {backgroundColor: 'white',height:320,margin:20,padding:20, borderRadius:20};
  console.log(field,"fieldsdasds")
  return (
    <View>
      <Portal>
        <Modal visible={visibleUpdate} onDismiss={hideUpdateModal} contentContainerStyle={containerStyle}>
          <View style={{display:"flex",flexDirection:'row',justifyContent:"flex-end"}}>
          <IconButton
        icon="close"
        size={30}
        onPress={hideUpdateModal}
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
              <Button mode="contained" onPress={()=>{handleSubmitUpdate(field)}} style={{padding:5,backgroundColor:"#B00020",color:"#fff"}}>
                UPDATE
             </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  )
}