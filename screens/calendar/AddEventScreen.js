// screens/AddUserScreen.js

import React, { Component } from 'react';
import { Text, Button, StyleSheet, TextInput, ScrollView, ActivityIndicator, View, SafeAreaView } from 'react-native';
import firebase from '../../database/firebaseDb';
import DateTimePicker from '@react-native-community/datetimepicker';
import { relativeTimeThreshold } from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign, Ionicons } from '@expo/vector-icons'


class AddEventScreen extends Component {
  constructor() {
    super();
    this.dbRef = firebase.firestore().collection('calendar');
    this.newRef = firebase.firestore().collection('calendar').doc('HHSziHpW6yHi73o6PvMc')
    this.state = {
      name: '',
      location: '',
      isLoading: false,
      date: new Date(),
      dateEnd: new Date(),
      mode: 'datetime',
      modeEnd: 'datetime',
      show:false,
      showEnd: false,
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
        [this.state.onlyDay]: firebase.firestore.FieldValue.arrayUnion({name: this.state.name, location: this.state.location, day: this.state.date, dateEnd: this.state.dateEnd}),
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

  setDate = (event, date, dateEnd) => {
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

  setDateEnd = (event, dateEnd) => {
    dateEnd = dateEnd || this.state.state
    this.setState({
        showEnd: Platform.OS==='ios'?true:false,
        dateEnd,
    })
    if (this.state.dateEnd == undefined) {
      this.setState({
        dateEnd: new Date(),
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

showEnd = modeEnd => {
  this.setState({
      showEnd: true,
      modeEnd,
  })
}

datepickerEnd = () => {
  this.showEnd('date')
}

timepickerEnd = () => {
  this.showEnd('time')
}


  render() {
    const {show, showEnd, date, dateEnd, mode, modeEnd} = this.state

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
          <TextInput
              placeholder={'Location'}
              value={this.state.location}
              onChangeText={(val) => this.inputValueUpdate(val, 'location')}
          />
        </View>
        <View >
        {/*Date Picker */}
          <View>
                <View
                  style={styles.datepicker}
                >
                  <Text style={{color: '#808080'}}>Event starts: </Text>
                  <Text>{date !== undefined ? date.toString().substr(0,21) : date }</Text>
                  <AntDesign style={{marginLeft:20}} name="calendar" size={34} color={'#000000'} onPress={this.datepicker}/>
                  <Ionicons style={{marginLeft:20}} name="md-timer" size={34} color={'#000000'} onPress={this.timepicker}/>
                </View>
                <View
                  style={styles.datepicker}
                >
                  <Text style={{color: '#808080'}}>Event ends: </Text>
                  <Text>{dateEnd !== undefined ? dateEnd.toString().substr(0,21) : dateEnd }</Text>
                  <AntDesign style={{marginLeft:20}} name="calendar" size={34} color={'#000000'} onPress={this.datepickerEnd}/>
                  <Ionicons style={{marginLeft:20}} name="md-timer" size={34} color={'#000000'} onPress={this.timepickerEnd}/>
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
                            {
                 showEnd  && <DateTimePicker
                      value={dateEnd}
                      mode={modeEnd}
                      is24Hour={true}
                      display='default'
                      onChange={this.setDateEnd}
                      dateFormat="year-month-day"
                  >
                  </DateTimePicker>
              }
          </View>
        
        </View>
        <View style={styles.button}>
          <Button
            title='Create Event'
            onPress={() => this.storeUser()} 
            color="#000000"
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  }
})

export default AddEventScreen;