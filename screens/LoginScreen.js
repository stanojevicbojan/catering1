import React from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, StatusBar, LayoutAnimation, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from 'react-native'
import firebase from 'firebase'

export default class LoginScreen extends React.Component {

static navigationOptions = {
  headerShown: false
}

state = {
  email: "",
  password: "",
  errorMessage: null
}

handleLogin = () => {
  const { email, password } = this.state

  firebase
    .auth()
    .signInWithEmailAndPassword(email,password)
    .catch(error => this.setState({ errorMessage: error.message}))
}

  render () {

    LayoutAnimation.easeInEaseOut()

    return (
<KeyboardAvoidingView
      behavior={Platform.Os == "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>

          <StatusBar barStyle="light-content"></StatusBar>

          <Image source={require('../assets/authHeader.png')} style={{marginTop: -100, marginLeft: -50}}
          ></Image>



          <Image source={require('../assets/loginLogo.png')} style={{marginTop: -70, marginLeft: 15, alignSelf: 'flex-start', width: 70, height: 70}}>
          </Image>

          <Text style={styles.greeting}>
            {`Hello again!\nWelcome back.`}
          </Text>
          <View style={styles.errorMessage}>
            {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
          </View>

          <View style={styles.form}>
            <View>
              <Text style={styles.inputTitle}>Email Address</Text>
              <TextInput
                style={styles.input}
                autoCapitalize='none'
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
              ></TextInput>
            </View>

            <View style={{marginTop: 32}}>
              <Text style={styles.inputTitle}>Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                onChangeText={password => this.setState( { password })}
                value={this.state.password}
              ></TextInput>
            </View>
          </View>

          <TouchableOpacity
            onPress={this.handleLogin}
            style={styles.button}
          >
            <Text style={{color: '#ffffff', fontWeight: '500'}}>Sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{alignSelf: 'center', marginTop: 32}}
            onPress={() => this.props.navigation.navigate("Register")}
          >
            <Text style={{color: '#414959', fontSize: 13}}>New user?
            <Text style={{fontWeight: '500', color: '#692df5'}}> Sign up here.</Text>
            </Text>
          </TouchableOpacity>

        </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around"
  },
  greeting: {
    marginTop: 32,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center'
  },
  errorMessage: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3
  },
  error: {
    color: '#E9446A',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center'
  },
  form: {
    marginBottom: 48,
    marginHorizontal: 38,
  },
  inputTitle: {
    color: '#8A8F9E',
    fontSize: 10,
    textTransform: 'uppercase'
  },
  input: {
    borderBottomColor: '#8A8F9E',
    borderBottomWidth: 1,
    height: 40,
    fontSize: 15,
    color: '#161F3D'
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: '#692df5',
    borderRadius: 4,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
