import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Vibration, AppState } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../styles/colors';
import styles from '../styles/detailStyle';
import DashedLine from '../components/dashedLine';
import AsyncStorage from '@react-native-async-storage/async-storage';
import vibrationPatterns from '../components/vibrationCollection';
import Triangle from '../components/triangle';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleLeft, faPlay, faPause, faStop, faForward, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import * as Notifications from 'expo-notifications';
import { formatDuration, formatDurationToNumeric } from '../helper/formatDuration';

const Detail = () => {

    // ========== Initiation ========== //
    const navigation = useNavigation();
    const route = useRoute();
    const [timers, setTimers] = useState([]);
    const [newTimer, setNewTimer] = useState({
        createdAt: Date.now(),
        title: 'Timer',
        duration: 60000,
        vibration: 'Alarm',
        breakPoints: []
    });
    useEffect(() => {
        const getTimers = async () => {
            try {
                const storedTimers = await AsyncStorage.getItem('timers');
                if (storedTimers === null) {
                    // If there are no timers, save the initial timer array
                    await AsyncStorage.setItem('timers', JSON.stringify([]));
                } else {
                    // If there are existing timers, set them to state
                    setTimers(JSON.parse(storedTimers));
                }
            } catch (error) {
                console.error('Error accessing AsyncStorage:', error);
            }
        };
        getTimers();
    }, []);
    const routeNewTimer = route.params?.timer;
    useEffect(() => {
        if (routeNewTimer) {
            // Check if routeNewTimer is an object
            if (typeof routeNewTimer === 'object' && routeNewTimer !== null) {
                if (routeNewTimer.duration && routeNewTimer.breakPoints && routeNewTimer.vibration && routeNewTimer.title && routeNewTimer.createdAt) {
                    if (routeNewTimer.title === '') {
                        const newTitle = formatDuration(routeNewTimer.duration);
                        setNewTimer(prevTimer => ({
                            ...routeNewTimer,
                            title: newTitle,
                            createdAt: Date.now(),
                        }));
                    } else {
                        setNewTimer(prevTimer => ({
                            ...routeNewTimer,
                            createdAt: Date.now(),
                        }));
                    }
                }
            } else {
                // Assuming routeNewTimer is a string (ID of the timer)
                for (let i = 0; i < timers.length; i++) {
                    if (timers[i].id === routeNewTimer) {
                        setNewTimer(timers[i]);
                        break;
                    }
                }
            }
        }
    }, [routeNewTimer, timers]);

    // ========== UI ========== //
    const [totalDuration, setTotalDuration] = useState("");
    useEffect(() => {
        let totalDuration = 0;
        totalDuration = formatDuration(newTimer.duration);
        setTotalDuration(totalDuration);
    }, [newTimer]);
    const availableDuration = useMemo(() => {
        const totalBreakpointsDuration = newTimer.breakPoints.reduce((acc, bp) => acc + bp.duration, 0);
        return newTimer.duration - totalBreakpointsDuration;
    }, [newTimer]);

    // ========== Navigation ========== //
    const handleBack = () => {
        navigation.navigate('Home');
    }
    const handleEdit = () => {
        console.log('DETAIL - sending timer:', newTimer);
        navigation.navigate('EditInfo', { timer: newTimer });
    }

    // ========== Play mode ========== //
    const [elapsedTime, setElapsedTime] = useState(0);
    const [playMode, setPlayMode] = useState('stop');
    const [appState, setAppState] = useState(AppState.currentState);
    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            if (appState.match(/inactive|background/) && nextAppState === 'active') {
                const lastStartedTime = await AsyncStorage.getItem('startedElapseTime');
                if (lastStartedTime) {
                    const currentElapsedTime = Date.now() - parseInt(lastStartedTime);
                    console.log('currentElapsedTime:', formatDurationToNumeric(currentElapsedTime));
                    setElapsedTime(currentElapsedTime);
                }
                console.log('lastStartedTime:', lastStartedTime);
                console.log('App has come to the foreground!');
            } else if (nextAppState.match(/inactive|background/)) {
                console.log('App has gone to the background!');
            }
            setAppState(nextAppState);
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, [appState]);
    const timerRef = useRef(null);

    const vibrationPoints = useMemo(() => {
        const points = newTimer.breakPoints.map(breakpoint => breakpoint.endAt);
        if (availableDuration > 0) {
            points.push(newTimer.duration);
        }
        return points;
    }, [newTimer.breakPoints]);
    useEffect(() => {
        if (vibrationPoints && vibrationPoints.length > 0) {
            AsyncStorage.removeItem('currentVibrationPoints');
            AsyncStorage.setItem('currentVibrationPoints', JSON.stringify(vibrationPoints));
        } else {
            AsyncStorage.removeItem('currentVibrationPoints');
        }
    }, [vibrationPoints])

    const [notificationContent, setNotificationContent] = useState({
        title: "Timer Alert",
        body: "Vibration point reached!",
        sound: '../assets/sounds/ring_bell.wav',
    });
    const scheduleNotificationsForVibrationPoints = async () => {
        const notificationConfigs = vibrationPoints.map(point => ({
            content: notificationContent,
            trigger: { seconds: point / 1000 },
        }));

        for (const config of notificationConfigs) {
            await Notifications.scheduleNotificationAsync(config);
        }
    };
    const cancelAllScheduledNotifications = async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
    };
    const startStopwatch = () => {
        if (!timerRef.current) {
            scheduleNotificationsForVibrationPoints();
            AsyncStorage.removeItem('startedElapseTime');
            AsyncStorage.setItem('startedElapseTime', Date.now().toString());
            console.log('startedElapseTime:', Date.now().toString());
            timerRef.current = setInterval(() => {
                setElapsedTime(prevElapsedTime => prevElapsedTime + 1000);
            }, 1000);
        }
    };
    const [storedElapsedTime, setStoredElapsedTime] = useState(null);
    useEffect(() => {
        console.log('storedElapsedTime:', storedElapsedTime);
    }, [storedElapsedTime])
    const pauseStopwatch = async () => {
        const startedElapseTime = await AsyncStorage.getItem('startedElapseTime');
        setStoredElapsedTime(startedElapseTime);
        AsyncStorage.removeItem('startedElapseTime');
        clearInterval(timerRef.current);
        timerRef.current = null;
        cancelAllScheduledNotifications();
    };
    const continueStopwatch = async () => {
        if (!timerRef.current) {
            const remainingVibrationPoints = vibrationPoints.filter(point => point > elapsedTime);
            const notificationConfigs = remainingVibrationPoints.map(point => {
                const remainingTime = point - elapsedTime;
                return {
                    content: notificationContent,
                    trigger: { seconds: remainingTime / 1000 },
                };
            });

            for (const config of notificationConfigs) {
                await Notifications.scheduleNotificationAsync(config);
            }

            timerRef.current = setInterval(() => {
                setElapsedTime(prevElapsedTime => prevElapsedTime + 1000);
            }, 1000);
        }
    };
    const resetStopwatch = async () => {
        AsyncStorage.removeItem('startedElapseTime');
        clearInterval(timerRef.current);
        timerRef.current = null;
        setElapsedTime(0);
        cancelAllScheduledNotifications();
    };

    const vibrationPointsInSeconds = vibrationPoints.map(point => Math.floor(point / 1000));
    const durationInSeconds = Math.floor(newTimer.duration / 1000);
    useEffect(() => {

        const elapsedTimeInSeconds = Math.floor(elapsedTime / 1000);
        const isVibrationTime = vibrationPointsInSeconds.includes(elapsedTimeInSeconds);

        if (isVibrationTime) {
            Vibration.vibrate(vibrationPatterns[newTimer.vibration]);
        }
        if (elapsedTimeInSeconds >= durationInSeconds) {
            setElapsedTime(newTimer.duration);
            setPlayMode('restart');
            pauseStopwatch();
        }

        console.log('elapsedTime:', elapsedTime);
        console.log('elapsedTime:', formatDurationToNumeric(elapsedTime));
    }, [elapsedTime, vibrationPoints, newTimer.vibration]);


    const handleModeChange = (mode) => {
        setPlayMode(mode);
        console.log('playMode:', mode);
        if (mode === 'play') {
            resetStopwatch();
            startStopwatch();
        } else if (mode === 'continue') {
            continueStopwatch();
        } else if (mode === 'pause') {
            pauseStopwatch();
        } else if (mode === 'stop') {
            resetStopwatch();
        }
    };

    // ========== Render ========== //
    const blockHeightThreshold = 300000;
    const blockHeightRatio = 5000;

    return (
        <View style={styles.container}>
            <View style={styles.breakpointTitleContainer}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }} onPress={handleBack}>
                    <FontAwesomeIcon icon={faAngleLeft} size={22} color={colors.Gray3} />
                    <Text style={styles.breakpointTitle}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleEdit}>
                    <Text style={[styles.breakpointTitle, { color: colors.black }]}>Edit</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.breakpointContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.breakpointBodyContainer}>
                    {newTimer.breakPoints.map((breakpoint, index) => (
                        <View key={index} style={[styles.breakPointObject, { zIndex: newTimer.breakPoints.length - index }]}>
                            <View style={styles.breakPointBlockContainer}>
                                <View
                                    style={[
                                        styles.breakPointBlock,
                                        (breakpoint.startAt < elapsedTime)
                                        && (breakpoint.endAt < elapsedTime
                                            ? { backgroundColor: colors.smokeWhite }
                                            : { backgroundColor: colors.lightRed }),
                                        { height: breakpoint.duration > blockHeightThreshold ? breakpoint.duration / blockHeightRatio : 60 },
                                        { justifyContent: breakpoint.duration > blockHeightThreshold ? 'flex-start' : 'center' }
                                    ]}
                                >
                                    <Text style={[
                                        styles.breakPointText,
                                        (breakpoint.startAt < elapsedTime)
                                        && (breakpoint.endAt < elapsedTime
                                            ? { color: colors.black }
                                            : { color: colors.red })
                                    ]}>{formatDuration(breakpoint.duration)}</Text>
                                </View>
                            </View>
                            <View style={styles.breakPointLineContainer}>
                                <View style={[styles.breakPointIndicator, (breakpoint.endAt < elapsedTime) && { backgroundColor: colors.red }]}>
                                    {breakpoint.endAt >= newTimer.duration ?
                                        (
                                            <Text style={[styles.breakPointIndicatorText,
                                            (breakpoint.endAt < elapsedTime) && { color: colors.white }
                                            ]}>
                                                End
                                            </Text>
                                        ) : (
                                            <Text style={[styles.breakPointIndicatorText,
                                            (breakpoint.endAt < elapsedTime) && { color: colors.white }
                                            ]}>
                                                {formatDuration(breakpoint.endAt)}
                                            </Text>
                                        )
                                    }
                                </View>
                                <View style={styles.lineContainer}>
                                    <DashedLine dashWidth={5} dashGap={5} dashColor={(breakpoint.endAt < elapsedTime) ? colors.red : colors.black} />
                                </View>
                            </View>
                        </View>
                    ))}
                    {availableDuration > 0 && (
                        <View style={[styles.breakPointObject, { zIndex: -2 }]}>
                            <View style={styles.breakPointBlockContainer}>
                                <View
                                    style={[
                                        styles.breakPointBlock,
                                        { backgroundColor: 'transparent', paddingHorizontal: 5 },
                                        { height: availableDuration > blockHeightThreshold ? (availableDuration / blockHeightRatio) + 20 : 80 },
                                        { justifyContent: availableDuration > blockHeightThreshold ? 'flex-start' : 'center' }
                                    ]}
                                >
                                    <Text style={[styles.breakPointText, { color: colors.Gray3, fontSize: 17 }]}>{formatDuration(availableDuration)} before end</Text>
                                </View>
                            </View>
                            <View style={styles.breakPointLineContainer}>
                                <View style={[styles.breakPointIndicator, (newTimer.duration <= elapsedTime) && { backgroundColor: colors.red }]}>
                                    <Text style={[styles.breakPointIndicatorText, (newTimer.duration <= elapsedTime) && { color: colors.white }]}>
                                        End
                                    </Text>
                                </View>
                                <View style={styles.lineContainer}>
                                    <DashedLine dashWidth={5} dashGap={5} dashColor={(newTimer.duration <= elapsedTime) ? colors.red : colors.black} />
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                {playMode !== '' &&
                    (<View style={styles.editingContainer}>
                        <View style={[styles.elapsedTimeContainer]}>
                            <Text style={styles.elapsedTimeText}>{formatDurationToNumeric(elapsedTime)}</Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar,
                            // elapsedTime > 0 && { backgroundColor: colors.lightRed }
                            ]}>
                                <View
                                    style={[styles.progressBarFill,
                                    { width: `${(elapsedTime / newTimer.duration) * 100}%` }
                                    ]}></View>
                            </View>
                        </View>
                    </View>)}
                <View style={styles.bottomButtonContainer}>
                    {playMode === 'stop' && (
                        <TouchableOpacity style={[styles.bottomButton, { backgroundColor: colors.black }]} onPress={() => handleModeChange('play')}>
                            <FontAwesomeIcon icon={faPlay} size={21} color={colors.white} />
                        </TouchableOpacity>
                    )}
                    {(playMode === 'play' || playMode === 'continue') && (
                        <TouchableOpacity style={[styles.bottomButton, { backgroundColor: colors.lightRed }]} onPress={() => handleModeChange('pause')}>
                            <FontAwesomeIcon icon={faPause} size={21} color={colors.red} />
                        </TouchableOpacity>
                    )}
                    {playMode === 'pause' && (
                        <View style={{ flex: 1, flexDirection: 'row', columnGap: 10 }}>
                            <TouchableOpacity style={[styles.stopButton, { backgroundColor: colors.Gray1 }]} onPress={() => handleModeChange('stop')}>
                                <FontAwesomeIcon icon={faStop} size={21} color={colors.black} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.bottomButton, { backgroundColor: colors.black }]} onPress={() => handleModeChange('continue')}>
                                <FontAwesomeIcon icon={faForward} size={21} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                    )}
                    {playMode === 'restart' && (
                        <View style={{ flex: 1, flexDirection: 'row', columnGap: 10 }}>
                            <TouchableOpacity style={[styles.stopButton, { backgroundColor: colors.Gray1 }]} onPress={() => handleModeChange('play')}>
                                <FontAwesomeIcon icon={faRotateRight} size={21} color={colors.black} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.bottomButton, { backgroundColor: colors.Gray1 }]} onPress={() => handleModeChange('stop')}>
                                <FontAwesomeIcon icon={faStop} size={21} color={colors.black} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View >
        </View >
    );
};

export default Detail;
