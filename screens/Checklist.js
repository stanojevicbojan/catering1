import React, { Component } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import firebase from '../database/firebaseDb';

export default class Checklist extends React.Component {
  constructor(props) {
    super(props);

    this.firestoreRef = firebase.firestore().collection('checklist')

      this.state = {
        itemInput: '',
        centerInput: '',
        myItems: {},
      }

    }

  componentDidMount() {
    this.listener = firebase.firestore().collection('checklist').onSnapshot(snap => {
      const myItems = {}
      snap.forEach(item => {
        myItems[item.id] = item.data()
      })
      this.setState({myItems})
    })
}  

  componentWillUnmount() {
    this.listener();
}


  render () {
    const itemInput = this.state.itemInput
    const centerInput = this.state.centerInput
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'stretch', justifyContent: 'flex-start', margin: 15}}>
          <TextInput
            style={{flex: 6,height: 50,}}
            label="New item"
            value={itemInput}
            onChangeText={itemInput => this.setState({itemInput})}
          />
          <Button style={{flex: 2, height: 50, padding: 2, marginLeft: 3,}}  mode="contained" onPress={() => console.log('Pressed')}>
          Add item
          </Button>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'stretch', justifyContent: 'flex-start', margin: 15}}>
          <TextInput
            style={{flex: 6,height: 50,}}
            label="New center"
            value={centerInput}
            onChangeText={centerInput => this.setState({centerInput})}
          />
          <Button style={{flex: 2, height: 50, padding: 2, marginLeft: 3,}}  mode="contained" onPress={() => console.log('Pressed')}>
          Add center
          </Button>
        </View>
        {console.log(this.state.myItems)}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
});