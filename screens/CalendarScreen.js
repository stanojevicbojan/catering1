import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Modal, Alert, TouchableHighlight } from 'react-native';
import { Agenda } from 'react-native-calendars'
import { Card } from 'react-native-paper';


export default function HelloWorldApp() {
  const [items, setItems] = useState({})

  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  const loadItems = (day) => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!items[strTime]) {
          items[strTime] = [];
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      const newItems = {};
      Object.keys(items).forEach(key => {newItems[key] = items[key];});
      setItems(newItems)
    }, 1000);
  }

  const renderItem = (item) => {
    
    return (
      <TouchableOpacity style={{marginRight: 10, marginTop: 17,}} >
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


  return (
    
    <View style={{flex: 1, marginTop:8,}}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={Date()}
        renderItem={renderItem}
        onDayPress={(day) => {console.log('selected day', day)}}
        firstDay={1}
        />
    </View>



  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 800,
      height: 500
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});