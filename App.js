import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
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
const App = () => {
  const [InternetPermission, setInternetPermission] = useState();

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
    if (Platform.OS === "android") {
      NetInfo.fetch().then((state) => {
        setInternetPermission(state.isConnected);
      });
    } else {
      // For iOS devices
      NetInfo.isConnected.addEventListener(
        "connectionChange",
        this.handleFirstConnectivityChange
      );
    }
  };
  return <>{InternetPermission === true ? <Main /> : <Message />}</>;
};

export default App;
