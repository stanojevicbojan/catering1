import React, { Component } from 'react';
import { Alert, Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View } from 'react-native';
import firebase from '../../database/firebaseDb';
import { openInbox } from 'react-native-email-link'
import { Linking } from 'expo';


class CenterDetailScreen extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      mobile: '',
      pm: '',
      maps: '',
      phone: '',
      isLoading: true
    };
  }
  


  componentDidMount() {

    const dbRef = firebase.firestore().collection('centers').doc(this.props.navigation.state.params.userkey)
    dbRef.get().then((res) => {
      if (res.exists) {
        const user = res.data();
        this.setState({
          key: res.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
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
    this.setState({
      isLoading: true,
    });
    const updateDBRef = firebase.firestore().collection('centers').doc(this.state.key);
    updateDBRef.set({
      name: this.state.name,
      email: this.state.email,
      mobile: this.state.mobile,
      pm: this.state.pm,
      maps: this.state.maps,
      phone: this.state.phone,
    }).then((docRef) => {
      this.setState({
        key: '',
        name: '',
        email: '',
        mobile: '',
        pm: '',
        maps: '',
        phone: '',
        isLoading: false,
      });
      this.props.navigation.navigate('Centers');
    })
    .catch((error) => {
      console.error("Error: ", error);
      this.setState({
        isLoading: false,
      });
    });
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
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              //multiline={true}
              //numberOfLines={4}
              placeholder={'AM'}
              value={this.state.email}
              onChangeText={(val) => this.inputValueUpdate(val, 'email')}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              placeholder={'Lunch'}
              value={this.state.mobile}
              onChangeText={(val) => this.inputValueUpdate(val, 'mobile')}
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
              placeholder={'PM'}
              value={this.state.pm}
              onChangeText={(val) => this.inputValueUpdate(val, 'pm')}
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
            title='Email'
            onPress={() =>   Linking.openURL(`mailto:${this.state.email}`)}
            color="#3340db"
            />
        </View>

        <View style={styles.callButtonContainer}>
          <Button
            title='Call'
            onPress={() =>   Linking.openURL(`tel:${this.state.mobile}`)}
            color="#5fcbe2"
          />
        </View>
        <View style={styles.button}>
          <Button
            title='Update'
            onPress={() => this.updateUser()}
            color="#19AC52"
          />
          </View>
         <View>
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
    padding: 35
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
  }
})

export default CenterDetailScreen;