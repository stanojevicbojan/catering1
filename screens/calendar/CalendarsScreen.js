import React, { Component } from 'react';
import { Alert, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, InteractionManager } from 'react-native';
import { Agenda } from 'react-native-calendars'
import { Card } from 'react-native-paper';
import { ListItem } from 'react-native-elements'
import firebase from '../../database/firebaseDb';
import { View, Button, Icon, Fab } from 'native-base';
import { Linking } from 'expo';
import colors from '../../Colors'
import * as Calendar from 'expo-calendar';
import RNCalendarEvents from 'react-native-calendar-events';


class CalendarsScreen extends Component {

  constructor(props) {
    super(props);
    this.firestoreRef = firebase.firestore().collection('calendar')
    this.calendarRef = firebase.firestore().collection('calendar')
    this.eventRemove = firebase.firestore().collection('calendar').doc('HHSziHpW6yHi73o6PvMc')

    this.state = {
      isLoading: true,
      userArr: [],
      active: false,
      items: {},
      myItems: {},
      selectedDay: ''
    };
  }

  componentDidMount() {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync();
      }
    })();
    this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
    this.listener = firebase.firestore().collection('calendar').onSnapshot(snap => {
      const myItems = {}
      snap.forEach(item => {
        myItems[item.id] = item.data()
      })
      this.setState({myItems})
    })
  }

  componentWillUnmount(){
    this.unsubscribe();
    this.listener();
  }

  getCollection = (querySnapshot) => {
    const userArr = [];
    querySnapshot.forEach((res) => {
      const { name, date } = res.data();
      userArr.push({
        key: res.id,
        res,
        name,
        date
      });
    });
    this.setState({
      userArr,
      isLoading: false,
   });
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.myItems[strTime]) {
          this.state.myItems[strTime] = [];
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            this.state.myItems[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
      this.setState({
        items: newItems
      });
    }, 1000);
  }

  createEvent(item) {
    const eventId = Calendar.createEventAsync("1", {
      endDate: item.dateEnd.toDate(),
      location: item.location,
      startDate: item.day.toDate(),
      timeZone: "GMT-6",
      title: item.name,
    });
  return eventId
  }

  createThreeButtonAlert = (item) => {
    let getDate = item.day.toDate().toISOString()
    let selectedDate = getDate.split("T")[0]
    let checkIfArrayEmpty = firebase.firestore().collection('calendar').doc('HHSziHpW6yHi73o6PvMc')
    emptyArrayChecker = () => {
      checkIfArrayEmpty.get().then(function(doc) {
        if (doc.exists && doc.data()[selectedDate].length < 1 ) {
          firebase.firestore().collection('calendar').doc('HHSziHpW6yHi73o6PvMc').update({
            [`${selectedDate}`]:firebase.firestore.FieldValue.delete()
          })
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
      }
    
    Alert.alert(
      `${item.name}`,
      `Starts: ${item.day.toDate().toString().substr(0,21)}\nEnds:${item.dateEnd.toDate().toString().substr(0,21)}, \nLocation: ${item.location}`,
      [
        {
          text: "Add to Google",
          onPress: () => this.createEvent(item)
        },
        {
          text: "Delete",
          onPress: () => {this.eventRemove.update({
            [`${selectedDate}`]: firebase.firestore.FieldValue.arrayRemove({dateEnd: item.dateEnd, day: item.day, location: item.location, name: item.name}),
          });emptyArrayChecker()},
          style: "cancel"
        },
        { text: "Close", onPress: () => console.log()}
      ],
      { cancelable: false }
    );

  }

  renderItem(item) {
    
    return (
      <TouchableOpacity
        style={{marginRight: 10, marginTop: 17,}}
        onPress={() => this.createThreeButtonAlert(item)}
      >
        <Card>
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 20,
                
              }}
            >
              <Text>{item.name}</Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    )
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
    <View style={styles.container}>
      <View style={{flexDirection: "row", marginTop: 20,marginBottom: -20}}>
        <View style={styles.headerDivider} />
          <Text style={styles.mainHeader}>
         Calendar<Text style={{fontWeight: "300", color: '#009688'}}></Text>
          </Text>
        <View style={styles.headerDivider} />
      </View>
      <View style={{flex: 1, marginTop:30,}}>
        <Agenda
          items={this.state.myItems.HHSziHpW6yHi73o6PvMc}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={Date()}
          renderItem={this.renderItem.bind(this)}
          onDayPress={(day) => {this.setState({selectedDay: day.dateString})}} //console.log('selected day', day)
          renderEmptyData={() => {return (<View><Text style={{alignSelf: 'center', marginTop: 15}}>No events for this day.</Text></View>);}}
          //firstDay={1}
          />
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={() => {this.props.navigation.navigate('AddEvent')}}>
            <Icon name="ios-add" />
          </Fab>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   //paddingBottom: 22
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
  divider: {
      backgroundColor: colors.lightBlue,
      height: 1,
      flex: 1,
      alignSelf: 'center'
  },
  title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.black,
      paddingHorizontal: 64,
  },
  headerDivider: {
      backgroundColor: colors.lightBlue,
      height: 1,
      flex: 1,
      alignSelf: 'center'
  },
  mainHeader: {
      fontSize: 38,
      fontWeight: "700",
      color: colors.black,
      paddingHorizontal: 64,
  },
})

export default CalendarsScreen