import React, { Component } from 'react';
import { View, Text, Platform, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight, Alert, ActivityIndicator, Modal, Animated, Image, SafeAreaView, FlatList} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import firebase from '../database/firebaseDb';
import { Table, TableWrapper, Cell, Row, Rows, Col } from 'react-native-table-component';
import colors from '../Colors'
import { Ionicons } from '@expo/vector-icons'
import {Icon, Fab } from 'native-base';
import ViewShot, {captureRef} from 'react-native-view-shot';
import * as WebBrowser from 'expo-web-browser';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import { Linking } from 'expo';



console.disableYellowBox = true;
export default class Checklist extends React.Component {
  constructor(props) {
    super(props);

    this.firestoreRef = firebase.firestore().collection('checklist')

      this.state = {
        itemInput: '',
        centerInput: '',
        myItems: {},
        tableHead: [],
        newTableHead: [],
        widthArr: [], // Width of each column
        //rowWidth: [200, 100, 100, 100, 100, 100],
        tableTitle: [],
        tableData: [],
        numOfCols: [],
        loading: true,
        modalVisible: false,
        modalSettingsVisible: false,
        colHeightArr: [],
        newCenterCheckmarks: {},
        uri: '',
        images: [],
        imageList: [],
      }

    }

    _alertIndex(index, cellIndex) {
      //Alert.alert(`This is row ${this.state.tableTitle[index]}, while column is ${this.state.tableHead[cellIndex + 1]}`);
      let toggle = !this.state.tableData[index][cellIndex]
      let name = "checkmark.".concat(this.state.tableHead[cellIndex + 1])
      let checkboxUpdate = firebase.firestore().collection('checklist')
      checkboxUpdate.where("name", "==", this.state.tableTitle[index])
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots, doc.data() returns all data in document
                return checkboxUpdate.doc(doc.id).update({
                 [`${name}`]: toggle
              })
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }

  async componentDidMount() {
    const permission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
  if (permission.status !== 'granted') {
      const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (newPermission.status === 'granted') {
        //its granted.
      }
  }
    this.listener = firebase.firestore().collection('checklist').orderBy('created').onSnapshot(snap => {
      const myItems = {};
      const tableTitle = [];
      let tableHead;
      let newTableHead = []
      let newCenterCheckmarks;
      let tableData = []
      snap.forEach(item => {
        myItems[item.id] = item.data()
        tableTitle.push(item.data().name) // gets all items for first column (center names) in table
        tableHead = Object.keys(item.data().checkmark) // gets all items for first row (header) in table
        tableData.push(Object.values(item.data().checkmark)) //gets all items in cells (true/false) in table
        newCenterCheckmarks = item.data().checkmark //creates new object with checkmars for new centar
        Object.keys(newCenterCheckmarks).forEach(v => newCenterCheckmarks[v] = false) //sets all items in object to false when creating new center
      })
      tableHead.forEach(item => {
        newTableHead.push(this.foodButton(item))
      })
      tableHead.unshift('');
      newTableHead.unshift('');
      this.setState({myItems, tableTitle, tableHead,newTableHead, tableData, loading: false, newCenterCheckmarks})
    })

    this.getWidthAndHeight = firebase.firestore().collection('lists').onSnapshot(snap => {
      let colHeightArr = []
      let widthArr = []
      snap.forEach(item => {
        colHeightArr = item.data().colHeight
        widthArr = item.data().widthArr
      })
      this.setState({colHeightArr, widthArr})
    })




    // Find all the prefixes and items.
    this.getImageName = firebase.storage().ref('images').listAll().then(res => {
      let images = []
      res.items.forEach(function(itemRef) {
        // All the items under listRef.
        images.push(itemRef.name)
      });
      this.setState({
        images
      })
    });
    
    // Since you mentioned your images are in a folder,
    // we'll create a Reference to that folder:
}  

  componentWillUnmount() {
    this.listener();
    this.getWidthAndHeight();
}

setModalVisible = (visible) => {
  this.setState({ modalVisible: visible });
}

setModalSettingsVisible = (visible) => {
  this.setState({ modalSettingsVisible: visible });
}

confirmationMessage = () => {
    Alert.alert(
      "New data added",
      "You have successfully added new data to the checklist.",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  }

resetConfirmation = () => {
  Alert.alert(
    "Are you sure?",
    "This will set the entire checklist to unchecked.",
    [{
      text: "Cancel",
      onPress: () => console.log("Cancel Pressed"),
      style: "cancel"
    },
      { text: "Yes", onPress: () => this.resetChecklist() }
    ],
    { cancelable: false }
  );
}

resetChecklist = () => {
  let clearChecklist = this.state.newCenterCheckmarks
  firebase.firestore().collection("checklist").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        doc.ref.update({
          checkmark: clearChecklist,
        });
    });
});
}

addCenter = () => {


  firebase.firestore().collection("checklist").doc(this.state.centerInput).set({
    checkmark: this.state.newCenterCheckmarks,
    id: this.state.centerInput,
    name: this.state.centerInput,
    created: firebase.firestore.Timestamp.now()
  })
  .catch(function(error) {
      console.error("Error writing document: ", error);
  });
  this.setState({centerInput:''})
  this.confirmationMessage()
}

deleteConfirmation = (index) => {
  Alert.alert(
    "Are you sure?",
    `This will remove ${this.state.tableTitle[index]} from the checklist.`,
    [{
      text: "Cancel",
      onPress: () => console.log("Cancel Pressed"),
      style: "cancel"
    },
      { text: "Yes", onPress: () => this.deleteCenter(index) }
    ],
    { cancelable: false }
  );
}

deleteCenter(index) {
  firebase.firestore().collection("checklist").doc(this.state.tableTitle[index]).delete().then(function() {
    console.log("Document successfully deleted!");
})
  .catch(function(error) {
    console.error("Error removing document: ", error);
});
}

addFood() {
  let updatedWidth = this.state.widthArr
  updatedWidth.push(200)
  let newFood = ''
  let checkmark = 'checkmark'
  newFood = this.state.itemInput
  newFood = checkmark.concat('.', newFood)
  firebase.firestore().collection("checklist").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          doc.ref.update({
            [`${newFood}`]: false
          });
      });
  })
  .then(function() {
    firebase.firestore().collection("lists").doc("width").update({
      widthArr: updatedWidth
    })
})
this.setState({itemInput:''})
this.confirmationMessage()
}

removeFood(header) {
  let updatedWidth = this.state.widthArr
  updatedWidth.pop()
  let checkmark = 'checkmark'
  let toRemove = header
  toRemove = checkmark.concat('.', toRemove)
  firebase.firestore().collection("checklist").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        doc.ref.update({
          [`${toRemove}`]: firebase.firestore.FieldValue.delete()
        });
    });
  })
  .then(function() {
    firebase.firestore().collection("lists").doc("width").update({
      widthArr: updatedWidth
    })
  })
}

deleteFoodConfirmation = (header) => {
  Alert.alert(
    "Are you sure?",
    `This will remove ${header} from the checklist.`,
    [{
      text: "Cancel",
      onPress: () => console.log("Cancel Pressed"),
      style: "cancel"
    },
      { text: "Yes", onPress: () => this.removeFood(header) }
    ],
    { cancelable: false }
  );
}

foodButton = (header) => (
  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
    <TouchableOpacity style={{marginRight: 5}} onPress={() => this.deleteFoodConfirmation(header)}>
      <Ionicons name={'md-more'} size={30} color={colors.gray} />
    </TouchableOpacity>
      <Text style={styles.text}>{header}</Text>
  </View>
);


onImageLoad = (uri) => {
  this.refs.viewShot.capture().then(uri => {
    console.log("do something with ", uri);
    //MediaLibrary.saveToLibraryAsync(uri)
    this.setState({
      uri: uri
    })
    this.uploadImage(uri, `img${Math.random()}`)
    .then(() => {
      Alert.alert("success");
    })
    .catch((error) => {
      Alert.alert(error);
    })
  })


};

getFileURL = async () => {
  let imageList = []
  for (let i = 0; i < this.state.images.length; i++) {
  const ref = firebase.storage().ref(`images/${this.state.images[i]}`);
  const url = await ref.getDownloadURL();
  imageList.push(url)
  }
  this.setState({
    imageList
  })
}

uploadImage = async (uri, imageName) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  var ref = firebase.storage().ref().child("images/" + imageName)
  return ref.put(blob)
}

  render () {
    if (this.state.loading) {
      return (
      <View style={styles.container}>
          <ActivityIndicator size='large' color={colors.blue}/>
      </View>
      )
    }
    const { modalVisible } = this.state;
    const { modalSettingsVisible } = this.state;
    const itemInput = this.state.itemInput
    const centerInput = this.state.centerInput
    const state = this.state;
    //this._alertIndex(index, cellIndex)
    const element = (data, index, cellIndex) => (
    
      <TouchableOpacity onPress={() => this._alertIndex(index, cellIndex)  }>
          <Ionicons style={styles.checkmark} name={this.state.tableData[index][cellIndex] == false ? 'ios-square-outline' : 'md-checkbox'} size={25} color={colors.gray} />
      </TouchableOpacity>
    
    );

    const colElement = (index) => (
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity style={{alignSelf: 'flex-start', flex: 1, paddingLeft: 30,}} onPress={() => this.deleteConfirmation(index)}>
            <Ionicons name={'md-more'} size={30} color={colors.gray} />
        </TouchableOpacity>
        <Text style={styles.columnText}>{this.state.tableTitle[index]}</Text>
      </View>
    );

    const renderItem = ({ item }) => (
      <View >
        <ScrollView horizontal={true}>
          <TouchableOpacity 
            style={{marginBottom: 20, marginTop: 20,}}
            onPress={() =>   Linking.openURL(item)}>
            <Image
            style={{width: 1000, height: 600, }}
            source={{uri: `${item}`}}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
      
    );

    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#3f51b5", justifyContent: 'flex-start', alignItems: 'flex-end', alignSelf: 'flex-start', borderRadius: 10}}
                onPress={() => {
                  this.setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableHighlight>
            <View style={{flexDirection: 'row', alignItems: 'stretch', justifyContent: 'flex-start', margin: 15}}>
              <TextInput
                style={{flex: 6,height: 50,}}
                label="New food"
                value={itemInput}
                onChangeText={itemInput => this.setState({itemInput})}
              />
              <Button style={{flex: 2, height: 50, padding: 2, marginLeft: 3,}} mode="contained" onPress={() => this.addFood()}><Text>Add food</Text></Button>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'stretch', justifyContent: 'flex-start', margin: 15}}>
              <TextInput
                style={{flex: 6,height: 50,}}
                label="New center"
                value={centerInput}
                onChangeText={centerInput => this.setState({centerInput})}
              />
              <Button style={{flex: 2, height: 50, padding: 2, marginLeft: 3,}} mode="contained" onPress={() => this.addCenter()}><Text>Add center</Text></Button>
            </View>


            </View>
          </View>
        </Modal>


        <Modal
          animationType="slide"
          transparent={true}
          visible={modalSettingsVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            
            <View style={styles.modalView}>
            <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#3f51b5", justifyContent: 'flex-start', alignItems: 'flex-end', alignSelf: 'flex-start', borderRadius: 10}}
                onPress={() => {
                  this.setModalSettingsVisible(!modalSettingsVisible);
                }}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableHighlight>
              <SafeAreaView style={{flex: 1, marginTop: 10}}>
                <FlatList
                  data={this.state.imageList}
                  renderItem={renderItem}
                  keyExtractor={item => item}
                />
              </SafeAreaView>
            <View style={{flexDirection: 'row'}}>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "red", alignSelf: 'flex-start' }}
                onPress={() => {
                  this.resetConfirmation();
                }}
              >
                <Text style={styles.textStyle}>Reset checklist</Text>
              </TouchableHighlight>

            </View>

            </View>
          </View>
        </Modal>



        <View style={styles.container1}>
          <View style={{flexDirection: "row", marginTop: -10,}}>
            <View style={styles.divider} />
              <Ionicons style={{marginTop: 10}} name="md-settings" size={34} color="black" onPress={() => {this.setModalSettingsVisible(true); this.getFileURL()}}
              />
              <Text style={styles.header}>
             Check<Text style={{fontWeight: "300", color: '#2196f3'}}>List</Text>
              </Text>
              <Button onPress={this.onImageLoad}>Take Snapshot</Button>
            <View style={styles.divider} />
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              {/* borderStyle={{borderWidth: 1}} */}
              <Table>
                <ScrollView style={{height:490}}>
                <ViewShot ref="viewShot">
                <TableWrapper>
                  {/* ako nesto ne bude radilo vrati ovo i uvezi sa firebase! widthArr={state.widthArr}  */}
                <Row  data={state.newTableHead} style={styles.head} textStyle={styles.text} widthArr={state.widthArr}/>
                </TableWrapper>
                {
                  state.tableData.map((rowData, index) => (
                    <TableWrapper key={index} style={styles.wrapper}>
                      <Cell style={styles.cell} data={index >= 0 ? colElement(index) : state.tableTitle[index]} textStyle={styles.columnText} />
                      {/*<Text>{console.log(rowData)}</Text> */}
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell style={styles.cell} key={cellIndex} data={cellIndex >= 0 ? element(cellData, index, cellIndex) : cellData} textStyle={styles.text}/>
                          
                        ))
                      }
                     
                    </TableWrapper>
                  ))
                 }
                  </ViewShot>
                </ScrollView>
              </Table>
            </View>
          </ScrollView>
        </View>
        <View>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={() => {
              this.setModalVisible(true);
            }}>
            <Icon name="ios-add" />
          </Fab>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 6, paddingTop: 20, paddingRight: 0,paddingBottom: 0 },
  container1: { flex: 1, padding: 3, paddingTop: 3, borderColor: 'black',paddingRight: 0},
  head: {  height: 60, backgroundColor: '#3f51b5'},
  wrapper: { flexDirection: 'row', marginLeft: 0, backgroundColor: 'white'},
  title: { flex: 1, width: 200,},
  textCol: {textAlign: 'center', fontWeight: '700'},
  row: {  height: 20},
  text: { textAlign: 'center', color: 'white', fontWeight: '700'}, //, marginLeft: 50
  columnText: {textAlign: 'center', color: 'grey', fontWeight: '700', alignSelf: 'center', flex: 1},
  checkmark: { alignSelf: 'center'},
  cell: {height: 60, width: 200, borderBottomWidth: 0.5, borderBottomColor: colors.lightBlue },
  divider: {
      backgroundColor: colors.lightBlue,
      height: 1,
      flex: 1,
      alignSelf: 'center'
  },
  header: {
      fontSize: 38,
      fontWeight: "700",
      color: colors.black,
      paddingHorizontal: 64,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 10
  },
  modalView: {
    margin: 5,
    backgroundColor: "white",
    borderRadius: 0,
    padding: 10,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#3f51b5",
    borderRadius: 2,
    padding: 10,
    elevation: 2,
    marginLeft: 20
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});