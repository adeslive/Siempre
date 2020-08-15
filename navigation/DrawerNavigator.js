//Commons
import {STRINGS, URLS} from '../commons'

import React, { Component } from 'react';
import { Platform } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

// Screens
import Exit from '../screens/Exit';
import Home from '../screens/Home';

export default class DrawerNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMounted: false
        }
        this.homeRef = React.createRef();
    }

    render() {
        const Drawer = createDrawerNavigator();
        const HomeScreen = React.forwardRef((props, ref) => <Home ref={ref => this.homeRef = ref} {...props}/>) 
        
        // Currently only the Home screen is being shown
        // To change the webview's current page with the drawers items, just use the first item
        // as an example. To add navigation add a screen and its component.
        return (
            <>
                {
                    <Drawer.Navigator
                    drawerType="slide"
                    backBehavior="initialRoute"
                    initialRouteName={STRINGS.SCREENS.HOME}
                    drawerContent={(props) => (
                        <DrawerContentScrollView {...props}>
                        
                            <DrawerItem
                                  label={ STRINGS.SCREENS.HOME }
                                  onPress={() => {
                                    this.homeRef.goTo(URLS.HOMEPAGE);
                                  }}
                            />

                            <DrawerItem
                                  label={STRINGS.SCREENS.ABOUT}
                                  onPress={() => {
                                    const currentURL = this.homeRef.state.url;
                                    if(currentURL.includes(URLS.ROOT)){
                                        this.homeRef.goTo(URLS.ABOUT_US);
                                    }else if(currentURL.includes("harvest.ftssol.com") || currentURL.includes("webstore.ftssol.com")){
                                        let newURL = currentURL.split("/")
                                        newURL = newURL[0] + "//" + newURL[2] + "/" + newURL[3] + "/" + newURL[4] + "/content/4-about-us"
                                        this.homeRef.goTo(newURL);
                                    }
                                }}
                            />

                            {Platform.OS != "ios" &&
                                <DrawerItem
                                    label={STRINGS.SCREENS.EXIT}
                                    onPress={() => props.navigation.jumpTo(STRINGS.SCREENS.EXIT)}
                                />
                            }
                        </DrawerContentScrollView> 
                    )}
                    >

                    <Drawer.Screen
                        name={ STRINGS.SCREENS.HOME }
                    >
                        {(props) => <HomeScreen ref={ref => this.homeRef = ref} {...props}/>}
                    </Drawer.Screen>

                    
                    {Platform.OS != "ios" &&
                        <Drawer.Screen
                            name= { STRINGS.SCREENS.EXIT }
                            component={Exit}
                        />
                    }

                </Drawer.Navigator>
                }
            </>
        );
    }
}

