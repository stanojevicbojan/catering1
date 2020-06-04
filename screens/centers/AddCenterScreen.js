// screens/AddUserScreen.js

import React, { Component } from 'react';
import { Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View } from 'react-native';
import firebase from '../../database/firebaseDb';

class AddCenterScreen extends Component {
  constructor() {
    super();
    this.dbRef = firebase.firestore().collection('centers');
    this.state = {
      name: '',
      email: '',
      mobile: '',
      /*new*/pm: '',
      /*new*/maps: '',
      phone: '',
      isLoading: false
    };
  }

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  storeUser() {
    if(this.state.name === ''){
     alert('Fill at least your name!')
    } else {
      this.setState({
        isLoading: true,
      });      
      this.dbRef.add({
        name: this.state.name,
        email: this.state.email,
        mobile: this.state.mobile,
        pm: this.state.pm,
        maps: this.state.maps,
        phone: this.state.phone,
      }).then((res) => {
        this.setState({
          name: '',
          email: '',
          mobile: '',
          pm: '',
          maps: '',
          phone:'',
          isLoading: false,
        });
        this.props.navigation.navigate('Centers')
      })
      .catch((err) => {
        console.error("Error found: ", err);
        this.setState({
          isLoading: false,
        });
      });
    }
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
              placeholder={'Google Maps Url'}
              value={this.state.maps}
              onChangeText={(val) => this.inputValueUpdate(val, 'maps')}
          />
        </View>
        <View style={styles.button}>
          <Button
            title='Add Center'
            onPress={() => this.storeUser()} 
            color="#19AC52"
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
  }
})

export default AddCenterScreen;