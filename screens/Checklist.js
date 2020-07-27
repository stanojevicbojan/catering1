import React, { Component } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

export default class Checklist extends React.Component {
  state = {
    itemInput: '',
    centerInput: '',
  }


  render () {
    const itemInput = this.state.itemInput
    const centerInput = this.state.centerInput
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'stretch', justifyContent: 'flex-start', margin: 15}}>
          <TextInput
            style={{flex: 6,height: 40,}}
            label="New item"
            value={itemInput}
            onChangeText={itemInput => this.setState({itemInput})}
          />
          <Button style={{flex: 2, height: 40, padding: 2, marginLeft: 3,}}  mode="contained" onPress={() => console.log('Pressed')}>
          Add item
          </Button>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'stretch', justifyContent: 'flex-start', margin: 15}}>
          <TextInput
            style={{flex: 6,height: 40,}}
            label="New center"
            value={centerInput}
            onChangeText={centerInput => this.setState({centerInput})}
          />
          <Button style={{flex: 2, height: 40, padding: 2, marginLeft: 3,}}  mode="contained" onPress={() => console.log('Pressed')}>
          Add center
          </Button>
        </View>
        {console.log(this.state.centerInput)}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
});