import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { API } from 'aws-amplify'
import { View,StyleSheet,ScrollView, Alert } from 'react-native';
import {Text, Portal,Button,Modal,TextInput,IconButton, ActivityIndicator,MD3Colors} from 'react-native-paper';
import UserModal from './components/Modal';
function HomeScreen() {
  const [visible, setVisible] = React.useState(false);
  const [item,setItems] = useState('')
  const [field,setFields] = useState({
    name:'',
    account:'',
    data:''
  })
  const handleOnChnage = (key,value) => {
    setFields((pre)=>({
      ...pre,
      [key]:value
    }))
  }

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const signOut = async () => {
    try {
      await Auth.signOut({ global: true });
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };
  const handleDelete = (itemToDelete) => {
    console.log(itemToDelete?.id, "----->>>");
    Alert.alert(
      'Alert',
      'Are you sure you want to delete?',
      [
        { text: 'Yes', onPress: () => {
          API.del('eventualdemo', `/api/${itemToDelete?.id}`, {})
            .then(result => {
              getUserRecords();
              Alert.alert("Alert", "Delete successfully");
            })
            .catch(err => {
              console.log(err);
            });
        } },
        { text: 'No', onPress: () => console.log('No') },
      ],
      { cancelable: false }
    );
  };
  
  const getUserRecords = () => {
    API.get('eventualdemo','/api', {}).then(result => {
      setItems(result)
     }).catch(err => {
      console.log(err,"Error====>>>>");
     })
  }
  useEffect(()=>{
    getUserRecords()
    // API.get('eventaulydemo',`/api/${1}`, {}).then((result) => {
    //   console.log(result)
    // }).catch(err => {
    //   console.log(err);
    // })
  },[])
  function getCurrentDate() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add 1 to month because it's 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
  
    const formattedDate = `${month}-${day}-${year}`;
    return formattedDate;
  }
  
  const handleSubmit = () => {
    API.post('eventualdemo', '/api', {
      body: {
        id: "2",
        name: field.name
      }
    }).then(result => {
      getUserRecords();
      hideModal();
      Alert.alert("Alert", "Record has been created");
      console.log(result);
    }).catch(err => {
      console.log(err);
    });
  };
  
  console.log(field.account,"account")
  console.log(item,"Items")
  console.log(Date.UTC().toString())
  return (
    <View>
        <View style={styles.DataTable}>
      <View style={styles.DataTableHeader}>
        <Text style={styles.DataTableTitle}>Name</Text>
        <Text style={[styles.DataTableTitle, styles.numeric]}>Account</Text>
        <Text style={[styles.DataTableTitle, styles.numeric]}>Date</Text>
        <Text style={[styles.DataTableTitle, styles.numeric]}>Action</Text>
        
      </View>
      <View>
  {!item ? (
    <View style={{position:'absolute',justifyContent:"center",alignItems:'center',left:0,right:0,bottom:0,top:250}}>
      <ActivityIndicator size={'small'} animating={'true'}/>
    </View>
  ) :
  item.length === 0 ? (
    <View style={{display:'flex',justifyContent:"center",alignItems:'center',marginTop:250}}>
      <Text variant='bodyLarge'>No Records</Text>
    </View>
  )
  :
  (
    <ScrollView>
      {
        item.map((val,index) => (
          <View style={styles.DataTableHeader} key={index}>
            <Text style={styles.DataTableTitle}>{val.name}</Text>
            <Text style={[styles.DataTableTitle, styles.numeric]}>{val.account}</Text>
            <Text style={[styles.DataTableTitle]}>{val.date}</Text>
            <Text style={[styles.DataTableTitle]}>
            <View style={{ display:'flex',flexDirection: 'row',justifyContent:'space-between'}}>
            <IconButton
    
        icon="circle-edit-outline"
        iconColor={MD3Colors.primary50}
        size={30}
        onPress={() => console.log('Pressed')}
      />
              <IconButton
              style={{ marginLeft:-10 }}
        icon="delete-circle"
        iconColor={MD3Colors.error50}
        size={30}
        onPress={() => handleDelete(val)}
      />
            </View>
    
            </Text>
            
          </View>
        ))
      }
    </ScrollView>
  )}
</View>

    </View>
      <Button style={styles.create} icon="plus" mode="outlined" onPress={showModal}></Button>
      <Button style={styles.button} onPress={() => signOut()}>
        <Text style={styles.buttonText}>Sign out</Text>
        </Button>
        <UserModal
        showModal={showModal}
        hideModal={showModal}
        visible={visible}
        handleOnChnage={handleOnChnage}
        field={field}
        setFields={setFields}
        handleSubmit={handleSubmit}
        />
    </View>
  );
}
const styles = StyleSheet.create({
  DataTable: {
    flexDirection: 'column',
  },
  DataTableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    marginLeft:20,
  },
  DataTableTitle: {
    flex: 1,
    textAlign: 'left',
  },
  numeric: {
    textAlign: 'center',
  },
  DataTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    marginLeft:20
  },
  create:{
    position:"absolute",
    left:280,
    top:480,
    borderRadius:"100%",
    height:60,
    width:110,
    paddingTop:12
    
  },
  button: {
    position:"absolute",
    left:50,
    right:0,
    top:550,
    backgroundColor: '#B00020',
    padding: 10,
    borderRadius: "100%",
    height:60,
    width:300
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
export default HomeScreen;
