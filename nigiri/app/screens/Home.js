import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, PanResponder } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/homeStyle';
import colors from '../styles/colors';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus, faTrash, faTrashCan } from "@fortawesome/free-solid-svg-icons";

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

    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedTimers, setSelectedTimers] = useState([]);

    const deleteTimers = async () => {
        try {
            const newTimers = timers.filter(timer => !selectedTimers.includes(timer.createdAt));
            await AsyncStorage.setItem('timers', JSON.stringify(newTimers));
            setTimers(newTimers);
            setSelectedTimers([]);
        } catch (error) {
            console.error('Error accessing AsyncStorage:', error);
        }
    };
    const editToggle = () => {
        setSelectedTimers([]);
        setIsEditMode(!isEditMode);
    }
    
    const [detailTimer, setDetailTimer] = useState(null);
    useEffect(() => {
        if (detailTimer) {
            console.log("sending detail timer to Detail screen:", detailTimer);
            navigation.navigate('Detail', { timer: detailTimer });
        }
    }, [detailTimer]);

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
                    <View style={styles.topButtonContainer}>
                        {isEditMode && (
                            <TouchableOpacity onPress={deleteTimers}>
                                <FontAwesomeIcon icon={faTrash} size={20} color={colors.black} />
                            </TouchableOpacity>
                        )}
                        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={editToggle}>
                                {!isEditMode ? (
                                    <Text style={styles.topButtonText}>Edit</Text>
                                ) : (
                                    <Text style={styles.topButtonText}>Done</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView contentContainerStyle={styles.timersList} showsVerticalScrollIndicator={false}>
                        {[...timers]
                            .sort((a, b) => b.createdAt - a.createdAt)
                            .map((timer, index) => (
                                <TouchableOpacity key={index} style={[styles.timerBlock, (isEditMode && selectedTimers.includes(timer.createdAt)) && { backgroundColor: colors.Gray3 }]}
                                    onPress={() => {
                                        if (isEditMode) {
                                            if (selectedTimers.includes(timer.createdAt)) {
                                                setSelectedTimers(selectedTimers.filter(createdAt => createdAt !== timer.createdAt));
                                            } else {
                                                setSelectedTimers([...selectedTimers, timer.createdAt]);
                                            }
                                        }else{
                                            console.log('setting detail timer:', timer);
                                            setDetailTimer(timer);
                                        }
                                    }}>
                                    <Text style={[styles.timerDuration, isEditMode && { color: colors.darkGray }]}>
                                        {formatDuration(timer.duration)}
                                    </Text>
                                    <Text style={[styles.timerTitle, isEditMode && { color: colors.darkGray }]} numberOfLines={1} ellipsizeMode='tail'>
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
