import React, { Component } from 'react';
import { View, Text, Platform, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import firebase from '../database/firebaseDb';
import { Table, TableWrapper, Cell, Row, Rows, Col } from 'react-native-table-component';

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
        rowWidth: [100, 100, 100, 100, 100, 100],
        tableTitle: [],
        tableData: [
          ['1', '2'],
          ['a', 'b'],
        ],
      }

    }

    _alertIndex(index) {
      Alert.alert(`This is row ${index + 1}`);
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
        tableHead = Object.keys(item.data().checkmarks[0])
        tableData.push(Object.values(item.data().checkmarks[0]))
      })
      console.log(tableHead)
      tableHead.unshift('')
      this.setState({myItems, tableTitle, tableHead, tableData})
    })
}  

  componentWillUnmount() {
    this.listener();
}

toggleTodoCompleted = index => {
  let list = this.props.list
  list.todos[index].completed = !list.todos[index].completed
  this.props.updateList(list)
}


  render () {
    const itemInput = this.state.itemInput
    const centerInput = this.state.centerInput
    const state = this.state;

    const element = (data, index) => (
      <TouchableOpacity onPress={() => this._alertIndex(index)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>button</Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <View style={styles.container1}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <Table borderStyle={{borderWidth: 1}}>
                <Row  data={state.tableHead} widthArr={state.widthArr} style={styles.head} textStyle={styles.text}/>
                {
                  state.tableData.map((rowData, index) => (
                    <TableWrapper key={index} style={styles.wrapper}>
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell key={cellIndex} data={cellIndex === 1 ? element(cellData, index) : cellData} textStyle={styles.text}/>
                        ))
                      }
                    </TableWrapper>
                  ))
                 }

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
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  container1: { flex: 1, padding: 6, paddingTop: 3, backgroundColor: '#fff', borderWidth: 2, borderColor: 'black'},
  head: {  height: 28,  backgroundColor: '#f1f8ff'  },
  wrapper: { flexDirection: 'row' },
  title: { flex: 1, backgroundColor: '#f6f8fa', width: 200, flexDirection: 'row' },
  row: {  height: 28},
  text: { textAlign: 'center' }
});