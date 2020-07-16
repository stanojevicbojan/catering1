import React, { useEffect } from 'react';
import { View, Text, Button, Platform } from 'react-native';
import * as Calendar from 'expo-calendar';

export default function CalendarScreen() {
  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync();
        console.log('Here are all your calendars:');
        console.log({ calendars });
      }
    })();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Calendar Module Example</Text>
      <Button title="Create a new calendar event" onPress={createEvent} />
    </View>
  );
}

async function createEvent() {
  const eventId = await Calendar.createEventAsync("1", {
    endDate: "2020-07-16T20:00:00.000Z",
    location: "Valjevska",
    notes: "Notes about calendar",
    startDate: "2020-07-16T19:00:00.000Z",
    timeZone: "GMT-6",
    title: "First event",
  });
return eventId
}
