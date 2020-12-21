//Commons
import {IMAGES, COLORS} from '../commons';

import React, { Component } from 'react';
import { Animated, View, StyleSheet, Image, Modal } from 'react-native';

export default class FlipLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animValue: new Animated.Value(0),
        }

        // Animation
        this.frontFlip = this.state.animValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['0deg', '180deg']
        })

        this.backFlip = this.state.animValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['180deg', '360deg']
        })

        this.state.animValue.addListener(({ value }) => {
            this.value = value;
        });
    }

    componentDidMount() {
        this.flip();
    }

    flip() {
 
            Animated.sequence([
     
                Animated.spring(this.state.animValue, {
                    toValue: 180,
                    duration: 180,
                    useNativeDriver: true
                })
            ]).start(() => {
                this.state.animValue.setValue(0);
                this.flip()
            });

    }

    render() {
        return (
            <View
                visible={true}
		style={{position:'absolute', height:'100%', width:'100%', top:0, left:0, backgroundColor:COLORS.LOADER_BG_COLOR, zIndex:3}}
            >
                <View
                    style={styles.container}
                >

                    <Animated.View style={[styles.flip, { transform: [{ rotateY: this.frontFlip }] }]}>
                        <Image source={IMAGES.FLIP_IMAGE} />
                    </Animated.View>

                    <Animated.View style={[styles.flip, styles.flipBack, { transform: [{ rotateY: this.backFlip }] }]}>
                        <Image source={IMAGES.FLIP_IMAGE} />
                    </Animated.View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flip: {
        alignItems: 'center',
        justifyContent: 'center',
        backfaceVisibility: 'hidden'
    },
    flipBack: {
        position: 'absolute',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})