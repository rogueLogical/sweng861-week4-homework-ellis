import { Image, StyleSheet, Platform, Text, ScrollView, Pressable, View } from 'react-native';
import React, { useEffect, useState } from "react";
import { router } from 'expo-router';
const axios = require("axios").default;

axios.defaults = Object.assign(axios.defaults, {
  withCredentials: true,
  baseURL: 'http://localhost:9000'
})

export default function HomeScreen() {
  
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
    inputTitle: {
      fontSize: 12,
      fontWeight: 'bold'
    },
    input: {
      height: 40,
      paddingHorizontal: 20,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5
    },
    inputRed: {
      height: 40,
      paddingHorizontal: 20,
      borderColor: 'red',
      borderWidth: 1,
      borderRadius: 5
    },
    button: {
      backgroundColor: "gray",
      borderWidth: 1,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 5,
      width: 200
    },
    buttonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
      paddingHorizontal: 10
    }
  });

  const [content, setContent] = useState("Loading...");
  const [buttonText, setButtonText] = useState("Loading...")

  const getProfile = async () => {
    try {
      const { data: response } = await axios.get('/auth/profile');
      return response;
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  };

  const OnPressLogOut = () => {
    try {
      axios.get('/auth/logout')
      .then(() => {
        router.navigate('/login');
      })
      .catch((error) => {
        console.log(error);
        router.navigate('/login');
      })
      router.navigate('/login');
    } catch (error) {
      console.log(error);
    };
  };

  useEffect(() => {
    getProfile()
    .then((data) => {
      if(data) {  
        const { username, organization, occupation, zodiac } = data;
        setContent("Username: " + username + "\nOrganization: " + organization + "\nOccupation: " + occupation + "\nZodiac Sign: " + zodiac);
        setButtonText('Log Out')
      }
      else {
        setContent("You are not logged in. Log In, or create an account to continue.");
        setButtonText('Log In')
      }
      
    })
  }, []);
  
/*   const profile = await getProfile();
  
  if(profile) {
    const { username, organization, occupation, zodiac } = profile;
    setContent("Username: " + username + "\nOrganization: " + organization + "\nOccupation: " + occupation + "\nZodiac Sign: " + zodiac);
  }
  else {
    setContent("You are not logged in. Log In, or create an account to continue.");
  }; */
  
  return (
    <ScrollView>
      <View style={styles.pageView}>
        <Text style={styles.title}>{content}</Text>
        <Pressable style={styles.button} onPress={OnPressLogOut} >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
