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

import CalendarScreen from './screens/CalendarScreen'

import ContactsScreen from './screens/ContactsScreen'
import AddUserScreen from './screens/AddUserScreen';
import UserDetailScreen from './screens/UserDetailScreen';

import MenuScreen from './screens/MenuScreen'
import ShoppingScreen from './screens/ShoppingScreen'

import { decode, encode } from 'base-64'
global.crypto = require("@firebase/firestore");
global.crypto.getRandomValues = byteArray => { for (let i = 0; i < byteArray.length; i++) { byteArray[i] = Math.floor(256 * Math.random()); } }

if (!global.btoa) { global.btoa = encode; }

if (!global.atob) { global.atob = decode; }

import * as firebase from 'firebase'


var firebaseConfig = {
  apiKey: "AIzaSyAEaBCJpzH2ukDwzVJ9PbvjNXHai3TkWL8",
  authDomain: "catering-app-25021.firebaseapp.com",
  databaseURL: "https://catering-app-25021.firebaseio.com",
  projectId: "catering-app-25021",
  storageBucket: "catering-app-25021.appspot.com",
  messagingSenderId: "704821076290",
  appId: "1:704821076290:web:699e0f4c2314c33004e8db",
  measurementId: "G-N570BST9M0"
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
    Contacts: ContactsScreen,
    AddUserScreen: AddUserScreen,
    UserDetailScreen: UserDetailScreen,
    },
  {
    initialRouteName: 'Contacts',
  },
);

const CentersNavigation = createStackNavigator(
  {
    Centers: CentersScreen,
    AddCenterScreen: AddCenterScreen,
    CenterDetailScreen: CenterDetailScreen,
    },
  {
    initialRouteName: 'Centers',
  },
);


const AppTabNavigator = createBottomTabNavigator(
  {
    ToDo: {
      screen: ShoppingScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => <MaterialCommunityIcons name='cart' size={35} color={tintColor} />
      }
    },
    Calendar: {
      screen: CalendarScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => <MaterialCommunityIcons name='calendar' size={35} color={tintColor} />
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
    Menu: {
      screen: MenuScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => <MaterialCommunityIcons name='food' size={35} color={tintColor} />
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
