import React, { Component } from 'react';
import { Alert, Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View } from 'react-native';
import firebase from '../../database/firebaseDb';
import { openInbox } from 'react-native-email-link'
import { Linking } from 'expo';
import { Row } from 'native-base';


class EditEventScreen extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      am: '',
      lunch: '',
      pm: '',
      maps: '',
      phone: '',
      isLoading: true
    };
  }
  


  componentDidMount() {

    const dbRef = firebase.firestore().collection('calendar').doc(this.props.navigation.state.params.userkey)
    dbRef.get().then((res) => {
      if (res.exists) {
        const user = res.data();
        this.setState({
          key: res.id,
          name: user.name,
          am: user.am,
          lunch: user.lunch,
          pm: user.pm,
          maps: user.maps,
          phone: user.phone,
          isLoading: false
        });
      } else {
        console.log("Record does not exist!");
      }
    });
  }

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  updateUser() {
    if(this.state.name === ''){
      alert('Fill at least your name!')
     } else {
    this.setState({
      isLoading: true,
    });
    const updateDBRef = firebase.firestore().collection('centers').doc(this.state.key);
    updateDBRef.set({
      name: this.state.name,
      am: parseInt(this.state.am.replace(/[^0-9]/g, '')),
      lunch: this.state.lunch,
      pm: parseInt(this.state.pm),
      maps: this.state.maps,
      phone: this.state.phone,
    }).then((docRef) => {
     /* this.setState({
        key: '',
        name: '',
        am: '',
        lunch: '',
        pm: '',
        maps: '',
        phone: '',
        isLoading: false,
      });*/
      this.props.navigation.navigate('Centers');
    })
    .catch((error) => {
      console.error("Error: ", error);
      this.setState({
        isLoading: false,
      });
    });
  }
  }


  deleteUser() {
    const dbRef = firebase.firestore().collection('centers').doc(this.props.navigation.state.params.userkey)
      dbRef.delete().then((res) => {
          console.log('Item removed from database')
          this.props.navigation.navigate('Centers');
      })
  }

  openTwoButtonAlert=()=>{
    Alert.alert(
      'Delete Center',
      'Are you sure?',
      [
        {text: 'Yes', onPress: () => this.deleteUser()},
        {text: 'No', onPress: () => console.log('No item was removed'), style: 'cancel'},
      ],
      { 
        cancelable: true 
      }
    );
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }
    return (
      <ScrollView style={styles.container}>
        <View style={styles.inputGroup}>
          <TextInput
              placeholder={'Center name'}
              value={this.state.name}
              onChangeText={(val) => this.inputValueUpdate(val, 'name')}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              placeholder={'Phone'}
              value={this.state.phone}
              onChangeText={(val) => this.inputValueUpdate(val, 'phone')}
              keyboardType={'numeric'}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              //multiline={true}
              //numberOfLines={4}
              placeholder={'AM'}
              value={this.state.am}
              onChangeText={(val) => this.inputValueUpdate(val, 'am')}
              keyboardType={'numeric'}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              placeholder={'Lunch'}
              value={this.state.lunch}
              onChangeText={(val) => this.inputValueUpdate(val, 'lunch')}
              keyboardType={'numeric'}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              placeholder={'PM'}
              value={this.state.pm}
              onChangeText={(val) => this.inputValueUpdate(val, 'pm')}
              keyboardType={'numeric'}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              placeholder={'Google Maps url'}
              value={this.state.maps}
              onChangeText={(val) => this.inputValueUpdate(val, 'maps')}
          />
        </View>
        
        <View style={styles.emailButtonContainer}>
          <Button
            title='Call'
            onPress={() =>   Linking.openURL(`tel:${this.state.phone}`)}
            color="#3340db"
            />
        </View>

        <View style={styles.callButtonContainer}>
          <Button
            title='Open map'
            onPress={() =>   Linking.openURL(this.state.maps)}
            color="#5fcbe2"
          />
        </View>
        
        <View style={styles.updateButton}>
          <Button
            title='Update'
            onPress={() => this.updateUser()}
            color="#19AC52"
          />
          </View>
         <View style={styles.deleteButton}>
          <Button
            title='Delete'
            onPress={this.openTwoButtonAlert}
            color="#E37399"
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    marginBottom: 7, 
  },
  emailButtonContainer: {
    marginBottom: 5
  },
  callButtonContainer: {
    marginBottom: 5
  },
  updateButton: {
    marginTop: 20,
  },
  deleteButton: {
    marginTop: 7,
  }
})

export default EditEventScreen;