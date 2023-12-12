import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/homeStyle';
import colors from '../styles/colors';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
    const navigation = useNavigation();
    const [timers, setTimers] = useState([]);

    const getTimers = async () => {
        try {
            const storedTimers = await AsyncStorage.getItem('timers');
            if (storedTimers !== null) {
                setTimers(JSON.parse(storedTimers));
            }
        } catch (error) {
            console.error('Error accessing AsyncStorage:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getTimers();
        }, [])
    );

    const formatDuration = (milliseconds) => {
        const seconds = Math.floor((milliseconds / 1000) % 60);
        const minutes = Math.floor(milliseconds / (1000 * 60));
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedMinutes}:${formattedSeconds}`;
    };

    return (
        <View style={styles.container}>
            {timers.length === 0 ? (
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        Click the “+” button to Create a new timer
                    </Text>
                </View>
            ) : (
                <View style={styles.timersContainer}>
                    <ScrollView contentContainerStyle={styles.timersList} showsVerticalScrollIndicator={false}>
                        {[...timers] 
                            .sort((a, b) => b.createdAt - a.createdAt)
                            .map((timer, index) => (
                                <TouchableOpacity key={index} style={styles.timerBlock}>
                                    <Text style={styles.timerDuration}>{formatDuration(timer.duration)}</Text>
                                    <Text style={styles.timerTitle} numberOfLines={1} ellipsizeMode='tail'>
                                        {timer.title}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>
            )}

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Add')}
            >
                <FontAwesomeIcon icon={faPlus} size={24} color={colors.white} />
            </TouchableOpacity>
        </View>
    );
};

export default Home;
