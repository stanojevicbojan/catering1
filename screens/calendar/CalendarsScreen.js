import React, { Component } from 'react';
import { Alert, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, InteractionManager } from 'react-native';
import { Agenda } from 'react-native-calendars'
import { Card } from 'react-native-paper';
import { ListItem } from 'react-native-elements'
import firebase from '../../database/firebaseDb';
import { View, Button, Icon, Fab } from 'native-base';
import { Linking } from 'expo';
import colors from '../../Colors'


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
    };
  }

  componentDidMount() {
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

  createThreeButtonAlert = (item) =>
    Alert.alert(
      `Event name: ${item.name}`,
      `Date: ${item.day.toDate()}`,
      [
        {
          text: "Add to calendar",
          onPress: () => console.log("Ask me later pressed")
        },
        {
          text: "Delete",
          onPress: () => this.eventRemove.update({
            "2020-07-13": firebase.firestore.FieldValue.arrayRemove({name: item.name, day: item.day}),
          }),
          style: "cancel"
        },
        { text: "Close", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );

  renderItem(item) {
    
    return (
      <TouchableOpacity
        style={{marginRight: 10, marginTop: 17,}}
        onPress={() => this.createThreeButtonAlert(item)}
      >
        <Card>
          <Card.Content>
          {console.log(item)}

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
      <View style={{flex: 1, marginTop:30,}}>
        <Agenda
          items={this.state.myItems.HHSziHpW6yHi73o6PvMc}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={Date()}
          renderItem={this.renderItem.bind(this)}
          onDayPress={(day) => {console.log('selected day', day)}}
          renderEmptyData={() => {return (<View><Text>No events for this day.</Text></View>);}}
          firstDay={1}
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
})

export default CalendarsScreen