import React, { useEffect } from 'react';
import { BackHandler, Alert, View } from 'react-native';

export default function Exit({navigation, route}) {
    const Prompt = () => {
        Alert.alert("Hold on!", "Are you sure you wanna exit?", [
            {
                text: "Cancel",
                onPress: () => navigation.goBack(),
                style: "cancel"
            },
            { 
                text: "Yes", 
                onPress: () => BackHandler.exitApp() 
            }
        ]);
    }

    navigation.addListener("focus", Prompt);

    return null;
}
