import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Pressable, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

export default function LoginForm() {

  const userData = [
    {
      username: "chris",
      password: "password",
    },
    {
      username: "john",
      password: "something"
    }
  ]
  const pwdsByUser = Object.fromEntries(userData.map(({ username, password}) => [username, password]));

  const styles = StyleSheet.create({
    pageView: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40
    },
    formView: {
      borderColor: 'gray',
      borderWidth: 2,
      borderRadius: 10,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical:10,
      width: "80%",
      maxWidth: 500
    },
    title: {
      fontSize: 30,
      fontWeight: "bold",
      textAlign: "center",
      paddingVertical: 10
    },
    input: {
      height: 50,
      paddingHorizontal: 20,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5
    },
    inputRed: {
      height: 50,
      paddingHorizontal: 20,
      borderColor: 'red',
      borderWidth: 2,
      borderRadius: 5
    },
    button: {
      backgroundColor: "gray",
      borderWidth: 1,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 5
    },
    buttonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
      paddingHorizontal: 10
    }
  });

  const [state, setState] = useState({
    username: '',
    password: '',
    userFieldStyle: styles.input,
    pwdFieldStyle: styles.input,
    warningMessage: '',
  })

  const setUsername = (text: string) => {
    setState({
      username: text,
      userFieldStyle: styles.input,
      password: state.password,
      pwdFieldStyle: state.pwdFieldStyle,
      warningMessage: state.warningMessage,
    });
  }
  const setPassword = (text: string) => {
    setState({
      username: state.username,
      userFieldStyle: state.userFieldStyle,
      password: text,
      pwdFieldStyle: styles.input,
      warningMessage: state.warningMessage,
    });
  }
  const onPressLogin = () => {
    console.log("Attempted Login")
    console.log("username: " + state.username)
    console.log("password: " + state.password)

    if (pwdsByUser[state.username]) {
      if (pwdsByUser[state.username] == state.password) {
        console.log('login successful')
        setState({
          username: '',
          userFieldStyle: styles.input,
          password: '',
          pwdFieldStyle: styles.input,
          warningMessage: '',
        })
        router.navigate('/')
      }
      else {
        console.log('incorrect password')
        setState({
          username: state.username,
          userFieldStyle: styles.input,
          password: state.password,
          pwdFieldStyle: styles.inputRed,
          warningMessage: 'Wrong Password',
        })
      }
    }
    else {
      console.log('User Does Not Exist')
      setState({
        username: state.username,
        userFieldStyle: styles.inputRed,
        password: state.password,
        pwdFieldStyle: styles.input,
        warningMessage: 'Username not recognized.'
      })
    }
  }

  return (
    <View style={styles.pageView}>
      <View style={styles.formView}>
        <Text style={styles.title}>User Log-In:</Text>
        <View style={{paddingVertical: 5}}>
          <TextInput 
            style={state.userFieldStyle} 
            placeholder="Username"
            onChangeText={text => setUsername(text)}
            autoCorrect={false}
          />
        </View>
        <View style={{paddingVertical: 5}}>
          <TextInput 
            style={state.pwdFieldStyle} 
            placeholder="Password"
            secureTextEntry
            onChangeText={text => setPassword(text)}
            onSubmitEditing={onPressLogin}
            autoCorrect={false}
          />
        </View>
        <Text style={{color: 'red'}}>{state.warningMessage}</Text>
        <View style={{paddingVertical: 5}}>
          <Pressable 
            style={styles.button} 
            onPress = {onPressLogin}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

}
  