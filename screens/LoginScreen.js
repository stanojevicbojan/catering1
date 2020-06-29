import React from 'react'
import { Animated, View, Text, StyleSheet, TextInput, TouchableOpacity, Image, StatusBar, LayoutAnimation, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from 'react-native'
import firebase from 'firebase'
import LottieView from "lottie-react-native";

export default class LoginScreen extends React.Component {

static navigationOptions = {
  headerShown: false
}

state = {
  email: "",
  password: "",
  errorMessage: null
}

componentDidMount() {
  this.animation.play();
  // Or set a specific startFrame and endFrame with:
  // this.animation.play(30, 120);
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

          <Animated.View style={styles.animationContainer}>
            <LottieView
              ref={animation => {
                this.animation = animation;
              }}
              style={{
                width: 98,
                height: 98,
              }}
              source={require('../assets/food-carousel.json')}
              // OR find more Lottie files @ https://lottiefiles.com/featured
              // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
            />
          </Animated.View>

          <Text style={styles.greeting}>
            {`Please login below.`}
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
    padding: 14,
    flex: 1,
    justifyContent: "space-around"
  },
  greeting: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  errorMessage: {
    height: 52,
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
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginBottom: 15,
    paddingTop: 5,
  },
})
