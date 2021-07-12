import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

import React from 'react'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import * as Font from 'expo-font';

import LoadingScreen from './screens/LoadingScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'

import HomeScreen from './screens/HomeScreen'

import CentersScreen from './screens/centers/CentersScreen'
import AddCenterScreen from './screens/centers/AddCenterScreen'
import CenterDetailScreen from './screens/centers/CenterDetailScreen'

import Checklist from './screens/Checklist'

import ContactsScreen from './screens/ContactsScreen'
import AddUserScreen from './screens/AddUserScreen';
import UserDetailScreen from './screens/UserDetailScreen';

import CalendarsScreen from './screens/calendar/CalendarsScreen'
import AddEventScreen from './screens/calendar/AddEventScreen'
import EditEventScreen from './screens/calendar/EditEventScreen'


import ShoppingScreen from './screens/ShoppingScreen'

import { decode, encode } from 'base-64'
global.crypto = require("@firebase/firestore");
global.crypto.getRandomValues = byteArray => { for (let i = 0; i < byteArray.length; i++) { byteArray[i] = Math.floor(256 * Math.random()); } }

if (!global.btoa) { global.btoa = encode; }

if (!global.atob) { global.atob = decode; }

import firebase from 'firebase'


var firebaseConfig = {
  //hidden
};
// Initialize Firebase, u if stavljamo zbog dva projekta sa istim config-om koji baca error
if(!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

/*
const AppStack = createStackNavigator({
  Home: HomeScreen
})
*/

const ContactsNavigation = createStackNavigator(
  {
    Contacts: {
      screen: ContactsScreen,
      navigationOptions: {
        headerShown: false,
      }
    },
    AddUserScreen: AddUserScreen,
    UserDetailScreen: UserDetailScreen,
    },
  {
    initialRouteName: 'Contacts',
  },
);

const CentersNavigation = createStackNavigator(
  {
    Centers: {
      screen: CentersScreen,
      navigationOptions: {
        headerShown: false,
      }
    },
    AddCenterScreen: AddCenterScreen,
    CenterDetailScreen: CenterDetailScreen,
    },
  {
    initialRouteName: 'Centers',
  },
);

const CalendarNavigation = createStackNavigator(
  {
    Calendars: {
      screen: CalendarsScreen,
      navigationOptions: {
        headerShown: false,
      }
    },
    AddEvent: AddEventScreen,
    EditEvent: EditEventScreen,
  },
  {
    initialRouteName: 'Calendars',
  }
)


const AppTabNavigator = createBottomTabNavigator(
  {
    ToDo: {
      screen: ShoppingScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => <MaterialCommunityIcons name='cart' size={35} color={tintColor} />
      }
    },
    Checklist: {
      screen: Checklist,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => <MaterialCommunityIcons name='check-box-outline' size={35} color={tintColor} />
      }
    },
    Contacts: {
      screen: ContactsNavigation,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => <MaterialCommunityIcons name='account-multiple' size={35} color={tintColor} />
      }
    },
    Centers: {
      screen: CentersNavigation,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => <MaterialCommunityIcons name='office-building' size={35} color={tintColor} />
      }
    },
    Calendars: {
      screen: CalendarNavigation,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => <MaterialCommunityIcons name='calendar-multiselect' size={35} color={tintColor} />
      },
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => <MaterialCommunityIcons name='settings' size={35} color={tintColor} />
      }
    },
  },
  {
    tabBarOptions: {
      showLabel: false,
    }
  }
)


const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen,
})

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppTabNavigator,
      Auth: AuthStack
    },
    {
      initialRouteName: "Loading"
    }
  )
)
