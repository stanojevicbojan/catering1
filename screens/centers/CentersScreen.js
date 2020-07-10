// screens/UserScreen.js

import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from '../../database/firebaseDb';
import { View, Icon, Fab, Badge } from 'native-base';
import colors from '../../Colors'

class CentersScreen extends Component {

  constructor() {
    super();
    this.firestoreRef = firebase.firestore().collection('centers');
    this.state = {
      isLoading: true,
      userArr: [],
      active: false,
      amNumbersList: [],
      lunchNumbersList: [],
      pmNumbersList: [],
    };
  }

  componentDidMount() {
    this.unsubscribe = this.firestoreRef.onSnapshot(this.getCollection);
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  getCollection = (querySnapshot) => {
    const allAmNumbers = [];
    const allLunchNumbers = [];
    const allPmNumbers = [];
    const userArr = [];
    querySnapshot.forEach((res) => {
      const { name, am, lunch, pm, maps, phone } = res.data();
      userArr.push({
        key: res.id,
        res,
        name,
        am,
        lunch,
        pm,
        maps,
        phone,
      });
      for (let u = 0; u < userArr.length; u++) {
        allAmNumbers.push(userArr[u].am)
        allLunchNumbers.push(userArr[u].lunch)
        allPmNumbers.push(userArr[u].pm)
      }
    });
    this.setState({
      userArr,
      isLoading: false,
      amNumbersList: [...new Set(allAmNumbers)],
      lunchNumbersList: [...new Set(allLunchNumbers)],
      pmNumbersList: [...new Set(allPmNumbers)],
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
        <View style={{flexDirection: "row"}}>
            <View style={styles.divider} />
              <Text style={styles.title}>
              Centers <Text style={{fontWeight: "300", color: colors.grey}}>List</Text>
              </Text>
            <View style={styles.divider} />
          </View>
      <ScrollView style={{marginBottom: 20,}}>
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
                      <Text>Phone: {item.phone}</Text>
                      <Text>AM: {item.am}</Text>
                      <Text>Lunch: {item.lunch}</Text>
                      <Text>PM: {item.pm}</Text>
                    </View>
                  }
                  onPress={() => {
                    this.props.navigation.navigate('CenterDetailScreen', {
                      userkey: item.key
                    });
                  }}/>
              );
            })
          }
      </ScrollView>
      
      <View style={styles.fabContainer}>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={() => {
                this.props.navigation.navigate('AddCenterScreen');
              }}>
            <Icon name="ios-add" />
          </Fab>
        </View>
        <View style={styles.totalNumbers}>
        <Badge primary>
        <Text style={styles.textStyle}>Total AM: {this.state.amNumbersList.reduce(function(a,b) 
        { return a + b},0)}</Text>
        </Badge>

        <Badge>
        <Text style={styles.textStyle}>Total Lunch: {this.state.lunchNumbersList.reduce(function(a,b) { return a + b},0)}</Text>
        </Badge>

        <Badge info>
        <Text style={styles.textStyle}>Total PM: {this.state.pmNumbersList.reduce(function(a,b) { return a + b},0)}</Text>
        </Badge>
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   marginTop: 20,
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
  totalNumbers: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 7,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: "space-between",
    flexDirection: 'row',
    position: 'absolute', left: 0, right: 0, bottom: 0,
    alignItems: "center",
  },
  textStyle: {
    paddingTop: 3,
    color: 'white',
  },
  fabContainer: {
    flex: 1,
    marginBottom: 20,
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

export default CentersScreen