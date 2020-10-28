// screens/UserScreen.js

import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from '../database/firebaseDb';
import { View, Button, Icon, Fab } from 'native-base';
import { Linking } from 'expo';
import colors from '../Colors'


class ContactsScreen extends Component {

  constructor() {
    super();
    this.firestoreRef = firebase.firestore().collection('contacts');
    this.state = {
      isLoading: true,
      userArr: [],
      active: false,
      emailsList: []
    };
  }




  componentDidMount() {
    this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  getCollection = (querySnapshot) => {
    const allEmails = []
    const userArr = [];
    querySnapshot.forEach((res) => {
      const { name, school, email, mobile } = res.data();
      userArr.push({
        key: res.id,
        res,
        name,
        school,
        email,
        mobile,
      });
      for (let u = 0; u < userArr.length; u++) {
        allEmails.push(userArr[u].email)
      }
    });
    this.setState({
      userArr,
      isLoading: false,
      emailsList: [...new Set(allEmails)],
   });
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
       <View style={{flexDirection: "row", marginTop: 20,}}>
         <View style={styles.divider} />
         <Text style={styles.title}>
             Contacts <Text style={{fontWeight: "300", color: colors.pink}}>List</Text>
         </Text>
         <View style={styles.divider} />
       </View>
      <ScrollView>
       
          {
            this.state.userArr.map((item, i) => {
              return (
                <ListItem
                  key={i}
                  chevron
                  bottomDivider
                  title={item.name}
                  subtitle={
                    <View>
                      <Text style={{fontStyle: 'italic', fontWeight: '300'}}>{item.mobile}</Text>
                      <Text style={{fontWeight: 'bold'}}>{item.school}</Text>
                    </View>
                    }
                  onPress={() => {
                    this.props.navigation.navigate('UserDetailScreen', {
                      userkey: item.key
                    });
                  }}/>
              );
            })
          }
      </ScrollView>
      <View style={{ flex: 1 }}>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="ios-add" />
            <Button
              style={{ backgroundColor: '#3B5998' }}
              onPress={() => {
                this.props.navigation.navigate('AddUserScreen');
              }}
              >
              <Icon name="ios-person-add"/>
            </Button>
            <Button 
              style={{ backgroundColor: '#DD5144' }}
              onPress={() => Linking.openURL(`mailto:${this.state.emailsList.toString()}`)}
              >
              <Icon name="mail" />
            </Button>
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
      fontSize: 38,
      fontWeight: "700",
      color: colors.black,
      paddingHorizontal: 64,
  },
})

export default ContactsScreen