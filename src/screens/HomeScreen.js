import { Auth } from 'aws-amplify';
import { SECRET_KEY, ACCESS_KEY } from '@env';
import React, { useEffect, useState } from 'react';
import { API } from 'aws-amplify'
import * as AWS from 'aws-sdk';

AWS.config.update({ region: 'us-west-1',secretAccessKey:SECRET_KEY,
accessKeyId: ACCESS_KEY });
// Create an instance of the DynamoDB Document Client
const dynamodb = new AWS.DynamoDB.DocumentClient();
import { View,StyleSheet,ScrollView, Alert } from 'react-native';
import {Text,Button,IconButton, ActivityIndicator,MD3Colors} from 'react-native-paper';
import UserModal from './components/Modal';
import UpdateModal from './components/UpdateModal';
import {generateAiLikeUuid} from '../util/helper'
function HomeScreen() {
  const docClient = new AWS.DynamoDB.DocumentClient();
  const [visible, setVisible] = React.useState(false);
  const [visibleUpdate, setVisibleUpdate] = React.useState(false);
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
  const hideModal = () => {
    setVisible(false)
    refreshField()
  };

  const showUpdateModal = () => setVisibleUpdate(true);
  const hideUpdateModal = () => {
    setVisibleUpdate(false)
    refreshField()
  };
  const refreshField = () => {
    setFields({
      name:'',
      account:''
    })
  }
  const signOut = async () => {
    
      Alert.alert(
        'Alert',
        'Are you sure you want to logout?',
        [
          { text: 'Yes', onPress: async () => {
            try{
              await Auth.signOut({ global: true });
            }
            catch(e){
              Alert.alert('Alert','Something went wrong')
            }
          } },
          { text: 'No', onPress: () => console.log('No') },
        ],
        { cancelable: false }
      );
  };
  const handleDelete = (itemToDelete) => {
    Alert.alert(
      'Alert',
      'Are you sure you want to delete?',
      [
        { text: 'Yes', onPress: async () => {
          const params = {
            TableName: 'users-dev',
            Key: {
              'id': itemToDelete?.id
            },
          };
          
          // Perform the delete operation
          dynamodb.delete(params, (err, data) => {
            if (err) {
              Alert.alert('Alert','Something went wrong')
            } else {
              Alert.alert('Alert','Item deleted successfully')
              getUserRecords();
            }
          });
        } },
        { text: 'No', onPress: () => console.log('No') },
      ],
      { cancelable: false }
    );
  };
  const [loading,setLoading] = useState(false)
  const handleSubmitUpdate = async (field) => {
    const date = getCurrentDate()
    const params = {
      TableName: 'users-dev',
      Key: {
        // Specify the primary key attributes and their values to identify the item to update
        // For example:
        'id': field?.id
      },
      UpdateExpression: 'SET #nameAttr = :newName, #accountAttr = :newAccount, #dateAttr = :newDate',
      ExpressionAttributeNames: {
        '#nameAttr': 'name',
        '#accountAttr': 'account',
        '#dateAttr': 'date',
      },
      ExpressionAttributeValues: {
        ':newName': field?.name, // Specify the new value for the 'name' attribute
        ':newAccount':field?.account, // Specify the new value for the 'account' attribute
        ':newDate': date, // Specify the new value for the 'date' attribute
      },
      ReturnValues: 'ALL_NEW', // Optionally, specify what values to return after the update
    };
    // Perform the update operation
    dynamodb.update(params, (err, data) => {
      if (err) {
        Alert.alert('Alert',"Something went wrong")
      } else {
        hideUpdateModal()
        refreshField();
        getUserRecords()
        Alert.alert('Alert',"Record updated successfully")
      }
    });
  };
  const getUserRecords = () => {
    setLoading(true)
    API.get('eventaulfinal','/api', {}).then(result => {
      if(result)
      {
        setItems(result)
        setLoading(false)
      }
     }).catch(err => {
      Alert.alert('Alert',"Something went wrong")
      setLoading(false)
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
    const date = getCurrentDate()
    const generatedUuid = generateAiLikeUuid();
    API.post('eventaulfinal', '/api', {
      body: {
        id:generatedUuid,
        name: field.name,
        account:field.account,
        Date:date
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

  const handleEdit = (val) =>{
    console.log(val,"val=====>")
    setFields({
      id:val.id,
      name:val.name,
      account:val.account
    })
    showUpdateModal()
  }
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
      <ActivityIndicator size={'small'} animating={loading}/>
    </View>
  ) :
  item.length === 0 ? (
    <View style={{display:'flex',justifyContent:"center",alignItems:'center',marginTop:250}}>
      <Text variant='bodyLarge'>No Records</Text>
    </View>
  )
  :
  (
    <ScrollView style={{height:440}}>
      {
        item.map((val,index) => (
          <View style={styles.DataTableHeader} key={index}>
            <Text style={styles.DataTableTitle}>{val.name}</Text>
            <Text style={[styles.DataTableTitle, styles.numeric]}>{val.account}</Text>
            <Text style={[styles.DataTableTitle]}>{val.Date}</Text>
            <Text style={[styles.DataTableTitle]}>
            <View style={{display:'flex',flexDirection: 'row',justifyContent:'space-center',margin:10}}>
            <IconButton
    
        icon="circle-edit-outline"
        iconColor={MD3Colors.primary50}
        size={30}
        onPress={() => handleEdit(val)}
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
      <Button style={styles.insert} onPress={showModal}>
        <Text style={styles.buttonText}>Create</Text>
        </Button>
      <Button style={styles.button} onPress={() => signOut()}>
        <Text style={styles.buttonText}>Sign out</Text>
        </Button>
        <UserModal
        showModal={showModal}
        hideModal={hideModal}
        visible={visible}
        handleOnChnage={handleOnChnage}
        field={field}
        setFields={setFields}
        handleSubmit={handleSubmit}
        />
        <UpdateModal
          showUpdateModal={showUpdateModal}
          hideUpdateModal={hideUpdateModal}
          visibleUpdate={visibleUpdate}
          handleOnChnage={handleOnChnage}
          field={field}
          setFields={setFields}
         handleSubmitUpdate={handleSubmitUpdate}
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
  button: {
    position:"absolute",
    left:50,
    right:0,
    top:550,
    backgroundColor: '#B00020',
    padding: 10,
    borderRadius: 100,
    height:60,
    width:300
  },
  insert: {
    position:"absolute",
    left:50,
    right:0,
    top:480,
    backgroundColor: '#B00020',
    padding: 10,
    borderRadius: 100,
    height:60,
    width:300
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
export default HomeScreen;
