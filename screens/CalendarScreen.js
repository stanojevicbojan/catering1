import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

export default class CalendarScreen extends React.Component {

  render() {
    return (
      
      <View style={styles.container}>
 
  <CalendarList
  // Callback which gets executed when visible months change in scroll view. Default = undefined
  onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
  // Max amount of months allowed to scroll to the past. Default = 50
  pastScrollRange={0}
  // Max amount of months allowed to scroll to the future. Default = 50
  futureScrollRange={2}
  // Enable or disable scrolling of calendar list
  scrollEnabled={true}
  // Enable or disable vertical scroll indicator. Default = false
  showScrollIndicator={true}
  // Enable horizontal scrolling, default = false
  horizontal={true}
  // Enable paging on horizontal, default = false
  pagingEnabled={true}
  minDate={new Date()}
  onDayPress={day => {
    console.log('selected day', day)
  }}
/>


      </View>
      
    
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30
  }
})