import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import { WebView } from "react-native-webview";
import { getUserAgent, getBrand } from "react-native-device-info";
import DeviceInfo from "react-native-device-info";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import LocalStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  BackHandler,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Dimensions,
} from "react-native";
import { ViewPropTypes } from "deprecated-react-native-prop-types";
import CookieManager from "@react-native-cookies/cookies";
import messaging from "@react-native-firebase/messaging";
const Main = () => {
  const [user, setUser] = useState();
  let brand = DeviceInfo.getUserAgent().then((res) => {
    var res = res.replace(/Version(.....)/, "");
    setUser(res);
  });

  const useWebKit = true;
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

    let location = await Location.getCurrentPositionAsync({}).catch((err) => {
      console.log(err);
    });
  };

  useEffect(() => {
    test();
    getFCMToken();
  }, []);

  const test = () => {
    CookieManager.get("https://www.altaazej.ae").then((res) => {
      console.log("CookieManager.getAll from webkit-view =>", res);
    });
  };

  const getFCMToken = () => {
    messaging()
      .getToken()
      .then((token) => {
        const newCookie: = {
          name: "FCM_TOKEN",
            value: token,
            domain: "altaazej.ae",
            version: "1",
            expires: "2040-05-30T12:30:00.00-05:00",
        };
        
        CookieManager.set('http://example.com', newCookie, useWebKit)
          .then((res) => {
            console.log('CookieManager.set from webkit-view =>', res);
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

      try {
        document.getElementById('mo_btn-google').onclick = function(){
          window.ReactNativeWebView.postMessage("login")
        }
      } catch(e) {
        console.log('checkout page detected error')
      }
      
      alert(user)
      
  
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
        return true;
      }
    } else {
      BackHandler.exitApp();
      return true;
    }
    return false;
  });

  const ActivityIndicatorElement = () => {
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
          userAgent={user}
          onLoadStart={() => setVisible(true)}
          onLoad={() => setVisible(false)}
        />

        {visible ? <ActivityIndicatorElement /> : null}
      </View>
    </SafeAreaView>
  );
};

export default Main;
