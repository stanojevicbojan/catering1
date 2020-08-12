import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation} from 'react-native'
import firebase from 'firebase'
import { Button, Avatar } from 'react-native-paper';
import colors from '../Colors'

export default class HomeScreen extends React.Component {

  state = {
    email: '',
    name: ''
  }

  componentDidMount() {
    const {email, displayName} = firebase.auth().currentUser

    this.setState({ email, displayName })
  }

signOutUser = () => {
  firebase.auth().signOut()
}

  render () {
    LayoutAnimation.easeInEaseOut()
    
    return (
        <View style={styles.container}>
          <View style={{flexDirection: "row", marginTop: 40,marginBottom: 40}}>
            <View style={styles.divider} />
              <Text style={styles.header}>
             My <Text style={{fontWeight: "300", color: '#009688'}}>Account</Text>
              </Text>
            <View style={styles.divider} />
          </View>
          <Avatar.Icon size={100} icon="emoticon" style={{backgroundColor: '#009688'}} />
          <Text style={{fontSize: 25, marginTop: 10, marginBottom: 80}}>Hello <Text style={{fontWeight: '700'}}>{this.state.displayName}</Text>!</Text>
          <Button icon="logout" mode="contained" onPress={this.signOutUser} style={{backgroundColor: '#C2185B'}}>
          Logout
          </Button>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  divider: {
      backgroundColor: colors.lightBlue,
      height: 1,
      flex: 1,
      alignSelf: 'center'
  },
  header: {
      fontSize: 38,
      fontWeight: "700",
      color: colors.black,
      paddingHorizontal: 64,
  },
})
