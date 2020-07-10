// screens/AddUserScreen.js

import React, { Component } from 'react';
import { Text, Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View, SafeAreaView } from 'react-native';
import firebase from '../../database/firebaseDb';
import DateTimePicker from '@react-native-community/datetimepicker';
import { relativeTimeThreshold } from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons'


class AddEventScreen extends Component {
  constructor() {
    super();
    this.dbRef = firebase.firestore().collection('calendar');
    this.newRef = firebase.firestore().collection('calendar').doc('HHSziHpW6yHi73o6PvMc')
    this.state = {
      name: '',
      isLoading: false,
      date: new Date(),
      mode: 'datetime',
      show:false,
      onlyDay: '',
    };
  }

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  storeUser() {
    if(this.state.name === ''){
     alert('You have to name your event!')
    } else {
      this.setState({
        isLoading: true,
      });      
      this.newRef.update({
        [this.state.onlyDay]: firebase.firestore.FieldValue.arrayUnion({name: this.state.name, day: this.state.date}),
      }).then((res) => {
        this.props.navigation.navigate('Calendars')
      })
      .catch((err) => {
        console.error("Error found: ", err);
        this.setState({
          isLoading: false,
        });
      });
    }
  }

  setDate = (event, date) => {
    date = date || this.state.state
    this.setState({
        show: Platform.OS==='ios'?true:false,
        date,
        onlyDay: date.toISOString().split('T')[0]
    })
    if (this.state.date == undefined) {
      this.setState({
        date: new Date(),
      })
    }


}

show = mode => {
  this.setState({
      show: true,
      mode,
  })
}

datepicker = () => {
  this.show('date')
}

timepicker = () => {
  this.show('time')
}


  render() {
    const {show, date, mode} = this.state

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
              placeholder={'Event name'}
              value={this.state.name}
              onChangeText={(val) => this.inputValueUpdate(val, 'name')}
          />
        </View>
        <View style={styles.inputGroup}>
        {/*Date Picker */}
          <View>
              <View>
                <Text>Select date: </Text>
                <TouchableOpacity
                  style={styles.datepicker}
                  onPress={this.datepicker}
                >
                  <Text>{date !== undefined ? date.toString().substr(0,21) : date }</Text>
                  <AntDesign name="calendar" size={24} color={'#3f51b5'} />
                </TouchableOpacity>
              </View>
              <View>
              {console.log(this.state.onlyDay)}
                  <Button onPress={this.timepicker} title="SHOW TIME PICKER"></Button>
              </View>
              {
                  show && <DateTimePicker
                      value={date}
                      mode={mode}
                      is24Hour={true}
                      display='default'
                      onChange={this.setDate}
                      dateFormat="year-month-day"
                  >
                  </DateTimePicker>
              }
          </View>
        
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
  },
  datepicker: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  }
})

export default AddEventScreen;