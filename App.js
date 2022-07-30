import {
  setStatusBarNetworkActivityIndicatorVisible,
  StatusBar,
} from "expo-status-bar";
import React, { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { ReactNativeFirebase } from "@react-native-firebase/app";
import {
  Platform,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import Main from "./src/main";
import Message from "./src/internetmsg";
import { firebase } from "@react-native-firebase/app";
const App = () => {
  const [InternetPermission, setInternetPermission] = useState();
  const firebaseConfig = {
    apiKey: "AIzaSyAx1GtUFFA5H0twI5YXqGkFSHSDtYWvzzw",
    authDomain: "instagramapp-48811.firebaseapp.com",
    databaseURL: "https://instagramapp-48811.firebaseio.com",
    projectId: "instagramapp-48811",
    storageBucket: "instagramapp-48811.appspot.com",
    messagingSenderId: "695516979434",
    appId: "1:695516979434:web:71dbfb40ce90ad1e99b793",
    measurementId: "G-0HBSW2JSZV",
  };

  firebase.initializeApp(firebaseConfig);

  SplashScreen.preventAutoHideAsync()
    .then((result) =>
      console.log(`SplashScreen.preventAutoHideAsync() succeeded: ${result}`)
    )
    .catch(console.warn); // it's good to explicitly catch and inspect any error

  const hidesplash = () => {
    console.log("splash called");
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 3000);
  };

  useEffect(() => {
    hidesplash();
    CheckConnectivity();
  }, []);
  const CheckConnectivity = () => {
    // For Android devices
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);
      setStatusBarNetworkActivityIndicatorVisible;
      setInternetPermission(state.isConnected);
    });
  };
  return <>{InternetPermission === true ? <Main /> : <Message />}</>;
};

export default App;
