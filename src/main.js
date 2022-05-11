import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import DeviceInfo from "react-native-device-info";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  BackHandler,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { ViewPropTypes } from "deprecated-react-native-prop-types";
import messaging from "@react-native-firebase/messaging";
import { WebView } from "react-native-webview";
import CookieManager from "@react-native-cookies/cookies";
import LocalStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

const Main = () => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const webView = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [changestate, setChangeState] = useState();
  const [visible, setVisible] = useState(false);
  let citem = [];
  console.log(canGoBack);
  console.log(changestate);
  const _checkPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.log("Permission to access location was denied");
      // return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const checkgpseable = async () => {
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then((data) => {})
      .catch((err) => {});
  };

  useEffect(() => {
    // _checkPermission();
    getFCMToken();
  }, []);

  const getFCMToken = () => {
    messaging()
      .getToken()
      .then((token) => {
        CookieManager.set("https://www.altaazej.ae", {
          name: "FCM_TOKEN",
          value: token,
          domain: "altaazej.ae",
          version: "1",
          expires: "2022-05-30T12:30:00.00-05:00",
        }).then((done) => {
          LocalStorage.setItem("FCM_Token", token);
        });
      });
  };

  let jsCode = `
      try {
          document.getElementsByClassName('elementor-element-77b9258')[0].style.display = 'none'
          document.getElementsByClassName('elementor-element-ebbe3e6')[0].style.display = 'none'
          document.getElementsByClassName('elementor-element-c334c43')[0].style.display = 'none'
          document.getElementsByClassName('elementor-element-4f3b490')[0].style.marginTop = '50px'
          document.getElementsByClassName('elementor-element-67ab2c3')[0].style.marginTop = '50px'
      } catch(e) {
        console.log('error on home page has but not on checkout page')
      }


      try {
        document.getElementsByClassName('elementor-element-28770b3f')[0].style.display = 'none'
      } catch(e) {
        console.log('download app error')
      }


      try {
        document.getElementById('lpac-find-location-btn').onclick = function(){
          window.ReactNativeWebView.postMessage("hello")
        }
      } catch(e) {
        console.log('checkout page detected error')
      }
      
  
  `;

  const onmessage = (event) => {
    console.log("msg", event);
    if (event === "hello") {
      checkgpseable();
    }
  };

  BackHandler.addEventListener("hardwareBackPress", () => {
    if (canGoBack === true) {
      if (webView.current) {
        webView.current.goBack();
        return true; // PREVENT DEFAULT BEHAVIOUR (EXITING THE APP)
      }
    } else {
      BackHandler.exitApp();
      return true;
    }
    return false;
  });

  const ActivityIndicatorElement = () => {
    //making a view to show to while loading the webpage
    return (
      <View
        style={{
          flex: 1,
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "auto",
          marginBottom: "auto",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color="#009688" size="large" />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "#F5FCFF",
          flex: 1,
        }}
      >
        <WebView
          ref={webView}
          javaScriptEnabled={true}
          // domStorageEnabled={true}
          // startInLoadingState={true}
          // renderLoading={ ActivityIndicatorElement }
          source={{ uri: "https://altaazej.ae/" }}
          javaScriptCanOpenWindowsAutomatically={true}
          onNavigationStateChange={(e) => {
            setChangeState(e.loading);
            setCanGoBack(e.canGoBack);
          }}
          cacheEnabled={true}
          onMessage={(event) => {
            onmessage(event);
          }}
          injectedJavaScript={jsCode}
          userAgent={DeviceInfo.getUserAgent() + " - MYAPPNAME - android "}
          onLoadStart={() => setVisible(true)}
          onLoad={() => setVisible(false)}
        />

        {visible ? <ActivityIndicatorElement /> : null}
      </View>
    </SafeAreaView>
  );
};

export default Main;
