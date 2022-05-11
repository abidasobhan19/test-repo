import React, { useEffect, useState } from "react";
import { View, Text, BackHandler } from "react-native";

import Dialog from "react-native-dialog";
import RNRestart from "react-native-restart";
const Message = () => {
  const [visible, setVisible] = useState(true);

  const handleclose = () => {
    BackHandler.exitApp();
    return true;
  };

  return (
    <View style={{ width: 400, height: 400 }}>
      <Dialog.Container visible={visible}>
        <Dialog.Title>No Internet</Dialog.Title>
        <Dialog.Description>
          Make sure that Wifi or mobile data is turned on,then try again
        </Dialog.Description>
        <Dialog.Button label="Retry" onPress={() => RNRestart.Restart()} />
        <Dialog.Button label="Close" onPress={() => handleclose()} />
      </Dialog.Container>
    </View>
  );
};

export default Message;
