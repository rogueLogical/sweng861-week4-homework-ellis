import { StyleSheet, Pressable, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useState, useRef } from 'react'
import { SelectList } from "react-native-dropdown-select-list";
const axios = require("axios").default;

axios.defaults = Object.assign(axios.defaults, {
  withCredentials: false,
  baseURL: 'http://127.0.0.2:9000'
})

export default function AccountCreationForm() {
  // mock existing users
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
  // Stylesheet
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
        width: 150
      },
      buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        paddingHorizontal: 10
      }
    });

    // username field processing and data management
    const [username, setUsername] = useState('');
    const [usrFieldStyle, setUsrFieldStyle] = useState(styles.input);
    const [usernameWarningText, setUsernameWarningText] = useState('');
    const [usernameValid, setUsernameValid] = useState(false);
    const usernameTimeout = useRef(null);
    const usernameEntry = (text: string) => {
      clearTimeout(usernameTimeout.current);
      setUsername(text)
      setUsernameValid(false);
      usernameTimeout.current = setTimeout( () => {
        axios.post('/auth/user', {username: text})
        .then(() => {
          setUsrFieldStyle(styles.inputRed);
          setUsernameWarningText('Username Taken');
        })
        .catch(() => {
          if (text.length < 4) {
            setUsrFieldStyle(styles.inputRed);
            setUsernameWarningText('Username must be at least 4 characters');
          }
          else {
            setUsrFieldStyle(styles.input);
            setUsernameWarningText('');
            setUsernameValid(true);
          }
        });
      }, 2000);
    };

    // password field processing and data management
    const [password, setPassword] = useState('');
    const [pwdFieldStyle, setPwdFieldStyle] = useState(styles.input);
    const [passwordWarningText, setPasswordWarningText] = useState('');
    const [passwordValid, setPasswordValid] = useState(false);
    const passwordTimeout = useRef(null);
    const passwordEntry = (text: string) => {
      clearTimeout(passwordTimeout.current);
      setPassword(text)
      setPasswordValid(false);
      passwordTimeout.current = setTimeout(() => {
        if (text.length < 6) {
          setPwdFieldStyle(styles.inputRed);
          setPasswordWarningText('Password must be at least 6 characters');
        }
        else if (! (/[A-Z]/.test(text) && /[a-z]/.test(text))) {
          setPwdFieldStyle(styles.inputRed);
          setPasswordWarningText('Password must contain both\nuppercase and lowercase\ncharacters');
        }
        else {
          setPwdFieldStyle(styles.input);
          setPasswordWarningText('');
          if (passwordConf != '') {
            ConfirmPassword(passwordConf, text)
          }

        }
      }, 2000);
    };


    // password confirm field processing and data management
    const [passwordConf, setPasswordConf] = useState('');
    const [pwdConfFieldStyle, setPwdConfFieldStyle] = useState(styles.input);
    const [passwordConfWarningText, setPasswordConfWarningText] = useState('');
    const passwordConfTimeout = useRef(null);
    const ConfirmPassword = (p2: string, p1: string) => {
      if (p2 != p1) {
        setPwdConfFieldStyle(styles.inputRed);
        setPasswordConfWarningText('Passwords do not match');
      }
      else {
        setPwdConfFieldStyle(styles.input);
        setPasswordConfWarningText('');
        setPasswordValid(true);
      }
    }
    const passwordConfEntry = (text: string) => {
      clearTimeout(passwordConfTimeout.current);
      setPasswordConf(text)
      setPasswordValid(false);
      passwordConfTimeout.current = setTimeout(() => {
        ConfirmPassword(text, password);
      }, 2000);
    };

    // Date of Birth field processing and data management
    const [dob, setDob] = useState('');
    const [dobFieldStyle, setDobFieldStyle] = useState(styles.input);
    const [dobWarningText, setDobWarningText] = useState('');
    const [dobValid, setDobValid] = useState(false);
    const dobTimeout = useRef(null);
    const dobEntry = (text: string) => {
      clearTimeout(dobTimeout.current);
      setDob(text)
      setDobValid(false);
      dobTimeout.current = setTimeout(() => {
        if (! /^[0-9][0-9][0-9][0-9]\/[0-1][0-9]\/[0-3][0-9]/.test(text)) {
          setDobFieldStyle(styles.inputRed);
          setDobWarningText('Date format must match:\nYYYY/mm/dd');
        }
        else {
          setDobFieldStyle(styles.input);
          setDobWarningText('');
          setDobValid(true);
        }
      }, 2000);
    };

    // email field processing and data management
    const [email, setEmail] = useState('');
    const [emailFieldStyle, setEmailFieldStyle] = useState(styles.input);
    const [emailWarningText, setEmailWarningText] = useState('');
    const [emailValid, setEmailValid] = useState(false);
    const emailTimeout = useRef(null);
    const emailEntry = (text: string) => {
      clearTimeout(emailTimeout.current);
      setEmailFieldStyle(styles.input);
      setEmailConfFieldStyle(styles.input);
      setEmailConfWarningText('');
      setEmail(text)
      setEmailValid(false);
      emailTimeout.current = setTimeout(() => {
        if (! text.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
          setEmailFieldStyle(styles.inputRed);
          setEmailWarningText('Enter a Valid Email Address');
        }
        else {
          axios.post('/auth/email', {email: text})
          .then(() => {
            setEmailFieldStyle(styles.inputRed);
            setEmailWarningText('Email is already being used.');
          })
          .catch(() => {
            setEmailFieldStyle(styles.input);
            setEmailWarningText('');
            if (emailConf != '') {
              ConfirmEmail(emailConf, text)
            }
          });
        }
      }, 2000);
    };


    // email confirm field processing and data management
    const [emailConf, setEmailConf] = useState('');
    const [emailConfFieldStyle, setEmailConfFieldStyle] = useState(styles.input);
    const [emailConfWarningText, setEmailConfWarningText] = useState('');
    const emailConfTimeout = useRef(null);
    const ConfirmEmail = (p2: string, p1: string) => {
      if (p2 != p1) {
        setEmailConfFieldStyle(styles.inputRed);
        setEmailConfWarningText('Emails do not match');
      }
      else {
        setEmailConfFieldStyle(styles.input);
        setEmailConfWarningText('');
        setEmailValid(true);
      }
    }
    const emailConfEntry = (text: string) => {
      clearTimeout(emailConfTimeout.current);
      setEmailConfFieldStyle(styles.input);
      setEmailConf(text)
      setEmailValid(false);
      emailConfTimeout.current = setTimeout(() => {
        ConfirmEmail(text, email);
      }, 2000);
    };

    // Organization Name
    const [organization, setOrganization] = useState('');
    // Occupation
    const [occupation, setOccupation] = useState('');
    // Zodiac Sign
    const [selectedZodiac, setSelectedZodiac] = useState('');

    // Output Text
    const [outputText, setOutputText] = useState('');
    const [outputColor, setOutputColor] = useState('');

    const submitForm = () => {
      if (usernameValid && passwordValid && dobValid && emailValid) {
        
        setOutputText('')
        axios.post('/auth/register', {
          username: username,
          password: password,
          email: email,
          dob: dob,
          organization: organization,
          occupation: occupation,
          zodiac: selectedZodiac
        })
        .then(() => {
          setOutputColor('green')
          setOutputText( outputText + "ACCOUNT CREATED!");
        })
        .catch((error) => {
          console.log(error);
          setOutputColor('red');
          setOutputText(error.message);
        });

      }
      else {
        setOutputColor('red')
        setOutputText('Failed. Check Errors above.')
      }
    }

    return (
      <View style={styles.pageView}>
        <View style={styles.formView}>
          <Text style={styles.title}>Create an Account:</Text>
          <View style={{paddingVertical: 5}}>
            <Text style={styles.inputTitle}>Username:</Text>
            <TextInput 
              style={usrFieldStyle} 
              placeholder="Username"
              onChangeText={(text) => usernameEntry(text)}
              autoCorrect={false}
            />
            <Text style={{color: 'red'}}>{usernameWarningText}</Text>
          </View>
          <View style={{paddingVertical: 5}}>
            <Text style={styles.inputTitle}>Password: </Text>
            <TextInput 
              style={pwdFieldStyle} 
              placeholder="Set Password"
              secureTextEntry
              onChangeText={(text) => passwordEntry(text)}
              autoCorrect={false}
            />
            <Text style={{color: 'red'}}>{passwordWarningText}</Text>
          </View>
          <View style={{paddingVertical: 5}}>
            <Text style={styles.inputTitle}>Confirm Password:</Text>
            <TextInput 
              style={pwdConfFieldStyle} 
              placeholder="Confirm Password"
              secureTextEntry
              onChangeText={(text) => passwordConfEntry(text)}
              autoCorrect={false}
            />
            <Text style={{color: 'red'}}>{passwordConfWarningText}</Text>
          </View>
          <View style={{paddingVertical: 5}}>
            <Text style={styles.inputTitle}>Date of birth:</Text>
            <TextInput 
              style={dobFieldStyle} 
              placeholder='yyyy/mm/dd'
              onChangeText={(text) => dobEntry(text)}
              autoCorrect={false}
            />
            <Text style={{color: 'red'}}>{dobWarningText}</Text>
          </View>
          <View style={{paddingVertical: 5}}>
            <Text style={styles.inputTitle}>Your Email:</Text>
            <TextInput 
              style={emailFieldStyle} 
              placeholder="Email"
              onChangeText={(text) => emailEntry(text)}
              autoCorrect={false}
            />
            <Text style={{color: 'red'}}>{emailWarningText}</Text>
          </View>
          <View style={{paddingVertical: 5}}>
          <Text style={styles.inputTitle}>Confirm Email:</Text>
            <TextInput 
              style={emailConfFieldStyle} 
              placeholder="Confirm Email"
              onChangeText={(text) => emailConfEntry(text)}
              autoCorrect={false}
            />
            <Text style={{color: 'red'}}>{emailConfWarningText}</Text>
          </View>
          <View style={{paddingVertical: 5}}>
            <Text style={styles.inputTitle}>Organization name (optional):</Text>
            <TextInput style={styles.input} placeholder="Organization Name" onChangeText={(text) => setOrganization(text)}/></View>
          <View style={{paddingVertical: 5}}>
            <Text style={styles.inputTitle}>Occupation (optional):</Text>
            <TextInput style={styles.input} placeholder="Occupation" onChangeText={(text) => setOccupation(text)}/>
          </View>
          <View style={{paddingVertical: 5}}>
            <Text style={styles.inputTitle}>Zodiac Sign (optional):</Text>
            <SelectList
              boxStyles={{width: 200, borderRadius: 5}}
              setSelected={(val: string) => setSelectedZodiac(val)}
              data={[
                {key:'1', value:'Aries'},
                {key:'2', value:'Taurus'},
                {key:'3', value:'Gemini'},
                {key:'4', value:'Cancer'},
                {key:'5', value:'Leo'},
                {key:'6', value:'Virgo'},
                {key:'7', value:'Libra'},
                {key:'8', value:'Scorpio'},
                {key:'9', value:'Sagittarius'},
                {key:'10', value:'Capricorn'},
                {key:'12', value:'Aquarius'},
                {key:'13', value:'Pisces'},
              ]}
              save="value"
            />
          </View>
          
          <View style={{paddingVertical: 5, justifyContent: 'center', alignContent: 'center'}}>
            <Pressable style={styles.button} >
              <Text style={styles.buttonText} onPress={submitForm}>Submit</Text>
            </Pressable>
            <Text style={{color:outputColor}} >{outputText}</Text>
          </View>
        </View>
      </View>
    );
  
  }
  