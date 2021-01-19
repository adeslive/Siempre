// Common variables
import { STRINGS, URLS, COLORS, IMAGES } from '../commons';

import React from 'react';
import { WebView } from "react-native-webview";
import { TouchableOpacity } from 'react-native';
import FlipLoader from '../components/FlipLoader';
import { createStackNavigator } from '@react-navigation/stack';
import { View, BackHandler, Alert, Text, Image, Button, Animated, Platform } from 'react-native';

// Needed for the header, can be used if a certain url
// meets a criteria
const StackNavigator = createStackNavigator();
const HeaderHeight = Platform.OS === "android" ? 60 : 0;

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: STRINGS.TITLE,
            url: URLS.HOMEPAGE,
            loading: false,
            hasInternet: true,
            validURL: true,
            scrolled: false,
            canChange: true,
            headerValue: new Animated.Value(1),
            bodyValue: new Animated.Value(1),
        };

        this.checkInternet();

        // Animations for the header and body only used on Android
        // First two are for the header, later ones for the webview
        this.down = this.state.headerValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-60, 0]
        });

        this.up = this.state.headerValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -60]
        });

        this.bodyDown = this.state.bodyValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, HeaderHeight]
        });

        this.bodyUp = this.state.bodyValue.interpolate({
            inputRange: [0, 1],
            outputRange: [HeaderHeight, 0]
        });

        // Create Webview Reference
        this.Web = React.createRef();
    }

    componentDidMount() {

        // Backhandler when the back button is pressed in an android device
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            Alert.alert("Hold on!", "Are you sure you wanna exit?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => BackHandler.exitApp()
                }
            ]);
            return true;
        });
    }

    //Backhandler cleanup
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backHandler);
    }

    show() {
        setTimeout(() => this.setState({ loading: false }), 2000);
    }

    hide() {
        this.setState({ loading: true });
    }

    animate(param) {

        if (Platform.OS === "android") {
            if (this.state.canChange) {
                if ((param.nativeEvent.velocity.y > 0.06) && !this.state.scrolled) {
                    this.state.headerValue.setValue(0)
                    this.state.bodyValue.setValue(0)
                    this.setState({ scrolled: true })
                } else if (param.nativeEvent.velocity.y < -0.06 && this.state.scrolled) {
                    this.state.headerValue.setValue(0)
                    this.state.bodyValue.setValue(0)
                    this.setState({ scrolled: false })
                }
                this.setState({ canChange: false });

                Animated.parallel([Animated.spring(this.state.headerValue, {
                    toValue: 1,
                    speed: 15,
                    bounciness: 1,
                    useNativeDriver: true
                }),

                Animated.spring(this.state.bodyValue, {
                    toValue: 1,
                    speed: 15,
                    bounciness: 1,
                    useNativeDriver: true
                })], { stopTogether: true }).start(() => this.setState({ canChange: true }))
            }
        }
    }

    getAnimation() {
        if (this.state.scrolled) {
            return this.up;
        }
        return this.down;
    }

    getBodyAnimation() {
        if (this.state.scrolled) {
            return this.bodyUp;
        }
        return this.bodyDown;
    }

    goTo = (page) => {

        if (this.state.hasInternet && this.props.navigation.isFocused() && this.state.url != page && page != "") {
            this.props.navigation.closeDrawer();
            const redirectTo = 'window.location = "' + page + '"';
            this.Web.injectJavaScript(redirectTo);
        } else {
            this.props.navigation.jumpTo(STRINGS.SCREENS.HOME);
        }

    }

    navChange = (newNavState) => {
        if (this.state.url !== newNavState.url) {
            this.setState({
                url: newNavState.url,
                validURL: true
            })
        }
    }

    changeInternetStatus(value) {
        this.setState({ hasInternet: value });
    }

    changeValidURL(value) {
        this.setState({validURL: value})
    }

    checkInternet() {
        fetch(URLS.HOMEPAGE)
            .then((response) => {
                this.changeInternetStatus(response.status === 200 ? true : false);
            })
            .catch((error) => {
                this.changeInternetStatus(false);
            })
    }


    checkURL() {
        fetch(this.state.url)
            .then((response) => {
                this.changeValidURL(response.status === 200 ? true : false);
            })
            .catch((error) => {
                this.changeValidURL(false);
            })
    }

    render() {
        const navigation = this.props.navigation;
        const fixZoom = `const meta = document.createElement('meta'); meta.name="viewport" ;meta.content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"; document.getElementsByTagName('head')[0].appendChild(meta); navigator.location.getCurrentPosition(function(position){console.log(position)}, function(error){}, {})`;
        return (
            <StackNavigator.Navigator
                screenOptions={{
                    headerTransparent: Platform.OS === "android" ? true : false,
                }}
            >
                <StackNavigator.Screen
                    name={ STRINGS.TITLE }
                    options={
                        {
                            title: this.state.title,

                            headerStyle: {
                                transform: [
                                    { translateY: this.getAnimation() }
                                ]
                            },

                            headerBackground: () => {
                                return (<Animated.View style={{ backgroundColor: COLORS.PRIMARY_COLOR, width: '100%', height: '100%', transform: [{ translateY: this.getAnimation() }] }} />)
                            },

                            headerTitleStyle: {
                                fontWeight: '300',
                                color: '#ffffff',
                                fontSize: 22,
                                flex: 1,
                                textAlign: "center"
                            },

                            headerLeft: () => (
                                <TouchableOpacity
                                    onPress={navigation.toggleDrawer}>
                                    <Image
                                        style={{ width: 48, height: 48, resizeMode: 'contain', marginLeft: 4, marginTop: 4, tintColor: "#ffffff" }}
                                        source={IMAGES.MENU.HAMBURGUER} />
                                </TouchableOpacity>
                            ),

                            headerRight: () => {
                                if (this.state.hasInternet && this.Web !== null) {
                                    return (<TouchableOpacity
                                        onPress={this.Web.goBack}
                                    >
                                        <Image
                                            style={{ width: 18, height: 18, resizeMode: 'contain', marginLeft: 4, marginTop: 4, marginRight: 16, tintColor: "#ffffff" }}
                                            source={IMAGES.MENU.ARROWS.LEFT}
                                        />
                                    </TouchableOpacity>)
                                } else {
                                    return <View style={{ width: 18, height: 18 }} />;
                                }

                            }
                        }
                    }>

                    
                    {() => (
			<>
                        <Animated.View style={{ flex: 1, transform: [{ translateY: this.getBodyAnimation() }] }}>
                           
                        {
                                !this.state.validURL &&
                                this.state.hasInternet &&
                                <View
                                    style={{
                                        minHeight: '100%',
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        justifyContent: 'space-evenly'
                                    }}
                                >

                                    <View
                                        style={{
                                            alignItems: 'center',
                                            alignContent: 'center',
                                        }}
                                    >
                                        <Image source={IMAGES.NO_INTERNET} style={{ width: 192, height: 192, resizeMode: 'contain', marginBottom: 50 }} />
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                textAlign: 'center'
                                            }}>We are not able to display this website.
                                            Contact the site owner and try again later.
                                        </Text>

                                    </View>
                                    <Button title="Retry" onPress={() => this.checkURL()} color={COLORS.PRIMARY_COLOR}></Button>
                                </View>
                            }
                           
                            {
                                this.state.hasInternet &&
                                <WebView
                                    source={{ uri: URLS.HOMEPAGE }}
                                    onLoadStart={() => this.hide()}
                                    onLoadEnd={() => this.show()}
                                    onScroll={this.animate.bind(this)}
                                    onError={() => this.changeValidURL(false)}
                                    ref={webview => this.Web = webview}
                                    geolocationEnabled={true}
                                    onNavigationStateChange={this.navChange}
                                    injectedJavaScript={fixZoom}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                />
                            }

                            {
                                !this.state.hasInternet &&
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        justifyContent: 'space-evenly'
                                    }}
                                >

                                    <View
                                        style={{
                                            alignItems: 'center',
                                            alignContent: 'center',
                                        }}
                                    >
                                        <Image source={IMAGES.NO_INTERNET} style={{ width: 192, height: 192, resizeMode: 'contain', marginBottom: 50 }} />
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                textAlign: 'center'
                                            }}>This application requires internet access to work properly.
                                            Try again later or press this button.
                                        </Text>

                                    </View>
                                    <Button title="Retry" onPress={() => this.checkInternet()} color={COLORS.PRIMARY_COLOR}></Button>
                                </View>
                            }

                            {this.state.loading &&  <FlipLoader />}
                        </Animated.View>
			
			</>
                    )}
                </StackNavigator.Screen>
            </StackNavigator.Navigator>
        );
    }
}

