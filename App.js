import React from 'react';
import { PermissionsAndroid, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './navigation/DrawerNavigator';
import { STRINGS } from './commons';

const locationPermission = async () => {
  try{
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: `${STRINGS.TITLE} Location Permission`,
        message: `${STRINGS.TITLE} needs access to your location`,
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if(granted === PermissionsAndroid.RESULTS.GRANTED)
    {
     
    }
  }catch(err){
    console.warn(err);
  }
}

export default function App() {
  if(PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)){
    locationPermission();
  }
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <DrawerNavigation />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});