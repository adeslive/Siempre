//Commons
import { STRINGS, URLS, IMAGES, COLORS } from '../commons'

import React, { Component } from 'react';
import { Platform, Image, Text } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

// Screens
import Exit from '../screens/Exit';
import Home from '../screens/Home';

let currentURL = URLS.HOMEPAGE;
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
        const HomeScreen = React.forwardRef((props, ref) => <Home ref={ref => this.homeRef = ref} {...props} />)

        // Currently only the Home screen is being shown
        // To change the webview's current page with the drawers items, just use the first item
        // as an example. To add navigation add a screen and its component.
        return (
            <>
                <Drawer.Navigator
                    drawerType="slide"
                    backBehavior="initialRoute"
                    initialRouteName={STRINGS.SCREENS.HOME}
                    drawerContent={(props) => (
                        <DrawerContentScrollView {...props}>
                            <DrawerItem
                                icon={() =>
                                    <Image
                                        style={{
                                            width: 32,
                                            height: 32,
                                            resizeMode: 'contain',
                                            marginLeft: 4,
                                            tintColor: currentURL === URLS.HOMEPAGE ? COLORS.PRIMARY_COLOR : COLORS.BLACK
                                        }}
                                        source={IMAGES.MENU.HOME} />
                                }
                                label={() => <Text style={{ fontSize: 18 }}>{STRINGS.SCREENS.HOME}</Text>}
                                style={{
                                    top: 4,
                                    bottom: 4
                                }}
                                onPress={() => {
                                    currentURL = URLS.HOMEPAGE;
                                    this.homeRef.goTo(URLS.HOMEPAGE);
                                }}
                            />

                            <DrawerItem
                                icon={() =>
                                    <Image
                                        style={{
                                            width: 32,
                                            height: 32,
                                            resizeMode: 'contain',
                                            marginLeft: 4,
                                            tintColor: currentURL === URLS.ABOUT_US ? COLORS.PRIMARY_COLOR : COLORS.BLACK
                                        }}
                                        source={IMAGES.MENU.ABOUT_US} />
                                }
                                label={() => <Text style={{ fontSize: 18 }}>{STRINGS.SCREENS.ABOUT}</Text>}
                                style={{
                                    bottom: 4
                                }}
                                onPress={() => {
                                    let newURL = "";
                                    if (URLS.ABOUT_US.includes(URLS.ROOT)) {
                                        newURL = url.split("/")
                                        newURL = newURL[0] + "//" + newURL[2] + "/" + newURL[3] + "/" + newURL[4] + "/content/4-about-us"
                                        
                                    }else{
                                        newURL = URLS.ABOUT_US;
                                    }
                                    
                                    currentURL = newURL;
                                    this.homeRef.goTo(newURL);
                                }}
                            />

                            {Platform.OS != "ios" &&
                                <DrawerItem
                                    icon={({ focused }) =>
                                        <Image
                                            style={{
                                                width: 32,
                                                height: 32,
                                                resizeMode: 'contain',
                                                marginLeft: 4,
                                                tintColor: focused ? COLORS.PRIMARY_COLOR : COLORS.BLACK
                                            }}
                                            source={IMAGES.MENU.EXIT} />
                                    }
                                    label={() => <Text style={{ fontSize: 18 }}>{STRINGS.SCREENS.EXIT}</Text>}
                                    style={{
                                        bottom: 4
                                    }}
                                    onPress={() => props.navigation.jumpTo(STRINGS.SCREENS.EXIT)}
                                />
                            }
                        </DrawerContentScrollView>
                    )}
                >

                    <Drawer.Screen
                        name={STRINGS.SCREENS.HOME}
                    >
                        {(props) => <HomeScreen ref={ref => this.homeRef = ref} {...props} />}
                    </Drawer.Screen>


                    {Platform.OS != "ios" &&
                        <Drawer.Screen
                            name={STRINGS.SCREENS.EXIT}
                            component={Exit}
                        />
                    }

                </Drawer.Navigator>

            </>
        );
    }
}

