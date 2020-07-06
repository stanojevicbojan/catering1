import React, {Component} from 'react';
import { Alert, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars'
import { Card } from 'react-native-paper';


export default class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: {}
    };
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
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
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
  
  renderItem(item) {
    
    return (
      <TouchableOpacity
        style={{marginRight: 10, marginTop: 17,}}
        onPress={() => Alert.alert(item.name)}
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
    return (
      
      <View style={{flex: 1, marginTop:8,}}>
        <Agenda
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={Date()}
          renderItem={this.renderItem.bind(this)}
          onDayPress={(day) => {console.log('selected day', day)}}
          firstDay={1}
          />
      </View>



    );
  }
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