import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Text,
  View,
  NativeModules,
  NativeEventEmitter
} from 'react-native';
const { ApiModule } = NativeModules
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  viewContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: 'blue',
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

const createUuid = () => (
  Math.random()
      .toString(36)
      .substring(2) + Date.now().toString(36)
);

const callbacks = {};

const App = ({ appId, hostId, accessToken }) => {
  const [data, setData] = useState("");
  

  useEffect(() => {
    const responseListener = new NativeEventEmitter(ApiModule);
    responseListener.addListener('RN_RESPONSE_MESSAGE', message => {
      let response = JSON.parse(message);
      if (response) {
        let { uuid, result } = response;
        let callback = callbacks[uuid];
          if (callback) {
              try {
                  if (typeof result === 'object') {
                      callback(result);
                  } else {
                      let resultObject = JSON.parse(result || '');
                      if (resultObject) {
                          callback(resultObject);
                      } else {
                          callback(result);
                      }
                  }
              } catch (err) {
                  callback(result);
              }
              callbacks[uuid] = undefined;
          }
      }
    });
    return () => {
      responseListener?.remove?.();
    }
  }, []);

  const onGoBack = () => {
    const stringMessage = JSON.stringify({ func: 'dismiss', args: [], miniApp: {appId, hostId, accessToken}});
    ApiModule.requestMessage(stringMessage,  () => { });
  }

  const onSetData = (...params) => {
    const args = Array.from(params)
    const uuid = createUuid();
    const stringMessage = JSON.stringify({ func: 'setItem', args, uuid, miniApp: {appId, hostId, accessToken}});
    ApiModule.requestMessage(stringMessage, () => { });
  }

  const onGetData = (...params) => {
    const args = Array.from(params);
    const uuid = createUuid();
    callbacks[uuid] = (value) => setData(value);
    const stringMessage = JSON.stringify({ func: 'getItem', args, uuid, miniApp: {appId, hostId, accessToken}});
    ApiModule.requestMessage(stringMessage, () => { });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View
        style={styles.viewContent}
      >
        <Text>Welcome to NEO Mini-APP</Text>
        <Text style={{color: 'red'}}>{data}</Text>
        <TouchableOpacity onPress={() => onGoBack('123', 'abc')} style={styles.btn}>
          <Text style={{ color: 'white' }}>Click to Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSetData('test', 'NEO PAY SUPER APP')} style={styles.btn}>
          <Text style={{ color: 'white' }}>Click to Set Data</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onGetData('test')} style={styles.btn}>
          <Text style={{ color: 'white' }}>Click to Get Data</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
};

export default App;
