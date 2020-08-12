import React, { Component } from 'react';
import { View, Text, Platform, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import firebase from '../database/firebaseDb';
import { Table, TableWrapper, Cell, Row, Rows, Col } from 'react-native-table-component';
import colors from '../Colors'
import { Ionicons } from '@expo/vector-icons'

export default class Checklist extends React.Component {
  constructor(props) {
    super(props);

    this.firestoreRef = firebase.firestore().collection('checklist')

      this.state = {
        itemInput: '',
        centerInput: '',
        myItems: {},
        tableHead: [],
        widthArr: [200, 200, 200, 200], // Width of each column
        //rowWidth: [200, 100, 100, 100, 100, 100],
        tableTitle: [],
        tableData: [],
        numOfCols: [],
        loading: true,
        switch: false,
      }

    }

    toggle = () => {
      let switcharoo
      switcharoo = !this.state.switch
      this.setState({
        switch: switcharoo
      })
    }


    _alertIndex(index, cellIndex) {
      //Alert.alert(`This is row ${this.state.tableTitle[index]}, while column is ${this.state.tableHead[cellIndex + 1]}`);
      let toggle = this.state.switch
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

  componentDidMount() {
    this.listener = firebase.firestore().collection('checklist').onSnapshot(snap => {
      const myItems = {};
      const tableTitle = [];
      let tableHead;
      let tableData = []
      snap.forEach(item => {
        myItems[item.id] = item.data()
        tableTitle.push(item.data().name)
        tableHead = Object.keys(item.data().checkmark)
        tableData.push(Object.values(item.data().checkmark))
      })
      tableHead.unshift('')
      this.setState({myItems, tableTitle, tableHead, tableData, loading: false})
    })
}  

  componentWillUnmount() {
    this.listener();
}

  render () {
    if (this.state.loading) {
      return (
      <View style={styles.container}>
          <ActivityIndicator size='large' color={colors.blue}/>
      </View>
      )
    }

    const itemInput = this.state.itemInput
    const centerInput = this.state.centerInput
    const state = this.state;
    //this._alertIndex(index, cellIndex)
    const element = (data, index, cellIndex) => (
      <TouchableOpacity onPress={() => {this.toggle(); this._alertIndex(index, cellIndex)}  }>
          <Ionicons style={styles.checkmark} name={this.state.tableData[index][cellIndex] == false ? 'ios-square-outline' : 'md-checkbox'} size={25} color={colors.gray} />
      </TouchableOpacity>
      
    );

    return (
      <View style={styles.container}>
        <View style={styles.container1}>
          <View style={{flexDirection: "row", marginTop: -10,}}>
            <View style={styles.divider} />
              <Text style={styles.header}>
             Check<Text style={{fontWeight: "300", color: '#2196f3'}}>List</Text>
              </Text>
            <View style={styles.divider} />
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              {/* borderStyle={{borderWidth: 1}} */}
              <Table>
                <TableWrapper>
                <Row  data={state.tableHead} widthArr={state.widthArr} style={styles.head} textStyle={styles.text}/>
                </TableWrapper>
                <TableWrapper style={{backgroundColor: '#e8eaf6'}}>
                <Col data={state.tableTitle} style={styles.title} heightArr={[60, 60]} textStyle={styles.textCol}/>
                {
                  state.tableData.map((rowData, index) => (
                    
                    <TableWrapper key={index} style={styles.wrapper}>
                      {/*<Text>{console.log(rowData)}</Text> */}
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell style={styles.cell} key={cellIndex} data={cellIndex >= 0 ? element(cellData, index, cellIndex) : cellData} textStyle={styles.text}/>
                          
                        ))
                      }
                     
                    </TableWrapper>
                  ))
                 }
                </TableWrapper>
                {/*
                <TableWrapper style={styles.wrapper}>
                  <Col data={state.tableTitle} style={styles.title} heightArr={[28,28]} textStyle={styles.text}/>
                  <Rows  widthArr={state.rowWidth} data={state.tableData} flexArr={[1, 1, 1, 1, 1]} style={styles.row} textStyle={styles.text}/>
                </TableWrapper>*/}
              </Table>
            </View>
          </ScrollView>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'stretch', justifyContent: 'flex-start', margin: 15}}>
          <TextInput
            style={{flex: 6,height: 50,}}
            label="New item"
            value={itemInput}
            onChangeText={itemInput => this.setState({itemInput})}
          />
          <Button style={{flex: 2, height: 50, padding: 2, marginLeft: 3,}}  mode="contained" onPress={() => console.log('Pressed')}>Add item</Button>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'stretch', justifyContent: 'flex-start', margin: 15}}>
          <TextInput
            style={{flex: 6,height: 50,}}
            label="New center"
            value={centerInput}
            onChangeText={centerInput => this.setState({centerInput})}
          />
          <Button style={{flex: 2, height: 50, padding: 2, marginLeft: 3,}}  mode="contained" onPress={() => console.log('Pressed')}>Add center</Button>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 6, paddingTop: 30, backgroundColor: '#fff', paddingRight: 0 },
  container1: { flex: 1, padding: 3, paddingTop: 3, backgroundColor: '#fff', borderColor: 'black',paddingRight: 0},
  head: {  height: 60,  backgroundColor: '#3f51b5'  },
  wrapper: { flexDirection: 'row', marginLeft: 200 },
  title: { flex: 1, backgroundColor: 'black', width: 200 },
  textCol: {textAlign: 'center', fontWeight: '700', color: '#474747'},
  row: {  height: 20},
  text: { textAlign: 'center', color: 'white', fontWeight: '700'},
  checkmark: { alignSelf: 'center'},
  cell: {height: 60, width: 200},
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
});