import React from "react";
import getDirections from 'react-native-google-maps-directions'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'


export default class MapsDirections extends React.Component {

  handleGetDirections = () => {
    const data = {
       source: {
        latitude: -33.8356372,
        longitude: 18.6947617
      },
      destination: {
        latitude: -33.8600024,
        longitude: 18.697459
      },
      params: [
        {
          key: "travelmode",
          value: "driving"        // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: "dir_action",
          value: "navigate"       // this instantly initializes navigation using the given travel mode
        }
      ],
      waypoints: [
        {
          latitude: -33.8600025,
          longitude: 18.697452
        },
        {
          latitude: -33.8600026,
          longitude: 18.697453
        },
           {
          latitude: -33.8600036,
          longitude: 18.697493
        }
      ]
    }

    getDirections(data)
  }

  render() {
    return (
        <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={this.handleGetDirections} title="Get Directions">
            <Text style={styles.text}> Get Directions </Text>
        </TouchableOpacity>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        padding: 100,
        paddingTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: 'blue',
        width: 200,
        height: 20,
        padding: 20,
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: 20,
    },
    text: {
        color: 'white',
        fontWeight: '700'
    }
})