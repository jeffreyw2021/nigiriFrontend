import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Vibration } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../styles/colors';
import styles from '../styles/detailStyle';
import DashedLine from '../components/dashedLine';
import AsyncStorage from '@react-native-async-storage/async-storage';
import vibrationPatterns from '../components/vibrationCollection';
import Triangle from '../components/triangle';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleLeft, faPlay, faPause, faStop, faForward, faRotateRight } from "@fortawesome/free-solid-svg-icons";

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


    const prevBreakPointsRef = useRef();
    const didDurationChange = (currentBreakpoints, prevBreakpoints) => {
        if (currentBreakpoints.length !== prevBreakpoints.length) return true;

        for (let i = 0; i < currentBreakpoints.length; i++) {
            if (currentBreakpoints[i].duration !== prevBreakpoints[i].duration) {
                return true;
            }
        }
        return false;
    }
    useEffect(() => {
        const prevBreakPoints = prevBreakPointsRef.current;

        if (didDurationChange(newTimer.breakPoints, prevBreakPoints || [])) {
            let cumulativeStartAt = 0;
            const updatedBreakpoints = newTimer.breakPoints.map(breakpoint => {
                const updatedBreakpoint = {
                    ...breakpoint,
                    startAt: cumulativeStartAt,
                    endAt: cumulativeStartAt + breakpoint.duration
                };
                cumulativeStartAt += breakpoint.duration;
                return updatedBreakpoint;
            });

            setNewTimer(prevTimer => ({
                ...prevTimer,
                breakPoints: updatedBreakpoints
            }));
        }

        // Update the ref with the current breakpoints
        prevBreakPointsRef.current = newTimer.breakPoints;
    }, [newTimer.breakPoints]);

    // ========== UI ========== //
    const [totalDuration, setTotalDuration] = useState("");
    useEffect(() => {
        let totalDuration = 0;
        totalDuration = formatDuration(newTimer.duration);
        setTotalDuration(totalDuration);
    }, [newTimer]);
    const formatDuration = (milliseconds) => {
        const seconds = Math.floor((milliseconds / 1000) % 60);
        const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
        const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

        if (hours === 0 && minutes === 0 && seconds !== 0) {
            return `${seconds} sec`;
        } else if (hours === 0 && seconds !== 0 && minutes !== 0) {
            return `${minutes} min ${seconds} sec`;
        } else if (seconds === 0 && minutes !== 0 && hours !== 0) {
            return `${hours} h ${minutes} min`;
        } else if (hours === 0 && seconds === 0 && minutes !== 0) {
            return `${minutes} min`;
        } else if (minutes === 0 && seconds === 0 && hours !== 0) {
            return `${hours} h`;
        } else if (hours === 0 && minutes === 0 && seconds === 0) {
            return `0 sec`;
        } else {
            return `${hours} h ${minutes} min ${seconds} sec`;
        }
    };
    const formatDurationToNumeric = (milliseconds) => {
        let seconds = Math.floor((milliseconds / 1000) % 60);
        let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
        const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return `${hours}:${minutes}:${seconds}`;
    };

    // ========== Navigation ========== //
    const handleBack = () => {
        // Filter out breakpoints with a duration of 0
        const savedBreakpoints = newTimer.breakPoints.filter(breakPoint => breakPoint.duration !== 0);
        navigation.navigate('Home');
    }
    const handleEdit = () => {
        console.log('sending timer:', newTimer);
        navigation.navigate('EditInfo', { timer: newTimer });
    }

    // ========== Time Picker ========== //
    const availableDuration = useMemo(() => {
        const totalBreakpointsDuration = newTimer.breakPoints.reduce((acc, bp) => acc + bp.duration, 0);
        return newTimer.duration - totalBreakpointsDuration;
    }, [newTimer]);

    // ========== Play ========== //
    const [playMode, setplayMode] = useState('stop');
    const handlePlay = () => {
        setplayMode('play');
    }
    const handlePause = () => {
        setplayMode('pause');
    }
    const handleStop = () => {
        setplayMode('stop');
    }
    const handleContinue = () => {
        setplayMode('continue');
    }

    const timerDurationCollection = useMemo(() => {
        const durations = newTimer.breakPoints.map(breakpoint => breakpoint.duration);
        if (availableDuration > 0) {
            durations.push(availableDuration);
        }
        return durations;
    }, [newTimer.breakPoints, availableDuration]);
    const [elapsedTime, setElapsedTime] = useState(0);
    const pattern = vibrationPatterns[newTimer.vibration] || vibrationPatterns['Alarm'];
    const [countdown, setCountdown] = useState(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    useEffect(() => {
        if (elapsedTime >= (newTimer.duration / 1000)) {
            setplayMode('restart');
        }
    }, [elapsedTime, newTimer.duration]);

    useEffect(() => {
        let intervalId;
        let countdownIntervalId;

        // Calculate the initial scroll position after countdown
        const newTimerDurationSeconds = Math.floor(newTimer.duration / 1000);
        const basicScrollUnit = ((progressLineTotalLength) / newTimerDurationSeconds);
        const initialScrollPosition = basicScrollUnit;

        const startCounting = () => {
            setElapsedTime(elapsed => {
                // Update scroll position
                let newScrollPosition = 0;
                if (elapsed > 0) {
                    newScrollPosition = initialScrollPosition + ((elapsed - 1) * basicScrollUnit);
                } else {
                    newScrollPosition = initialScrollPosition + (elapsed * basicScrollUnit);
                }
                console.log('newScrollPosition:', newScrollPosition);
                setScrollPosition(newScrollPosition);

                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({
                        x: newScrollPosition,
                        animated: true
                    });
                }

                if (elapsed >= timerDurationCollection.reduce((a, b) => a + b, 0) / 1000) {
                    clearInterval(intervalId);
                    setplayMode('restart');
                }

                return elapsed + 1;
            });
        };

        switch (playMode) {
            case 'play':
                // Clear any existing intervals
                clearInterval(intervalId);
                clearInterval(countdownIntervalId);
                setCountdown(3); // 3-second countdown

                // Reset elapsed time and directly reset the ScrollView position
                setElapsedTime(0);
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({ x: 0, animated: false });
                }

                countdownIntervalId = setInterval(() => {
                    setCountdown(prevCountdown => {
                        if (prevCountdown === 1) {
                            clearInterval(countdownIntervalId);
                            intervalId = setInterval(startCounting, 1000);
                            return null;
                        }
                        return prevCountdown - 1;
                    });
                }, 1000);
                break;
            case 'pause':
                // Pause the ticking and scrolling
                clearInterval(intervalId);
                clearInterval(countdownIntervalId);
                break;
            case 'stop':
                // Stop and reset everything
                clearInterval(intervalId);
                clearInterval(countdownIntervalId);
                setCountdown(null);
                setElapsedTime(0);
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({ x: 0, animated: false });
                }
                break;
            case 'restart':
                // Behave the same as pause
                clearInterval(intervalId);
                clearInterval(countdownIntervalId);
                break;
            case 'continue':
                // Continue from where it was paused
                if (countdown === null) {
                    // If countdown is not active, continue the main timer
                    intervalId = setInterval(startCounting, 1000);
                } else {
                    // If countdown is active, continue the countdown
                    countdownIntervalId = setInterval(() => {
                        setCountdown(prevCountdown => {
                            if (prevCountdown === 1) {
                                clearInterval(countdownIntervalId);
                                intervalId = setInterval(startCounting, 1000);
                                return null;
                            }
                            return prevCountdown - 1;
                        });
                    }, 1000);
                }
                break;
        }

        return () => {
            clearInterval(intervalId);
            clearInterval(countdownIntervalId);
        };

    }, [playMode, timerDurationCollection, vibrationPoints, pattern, newTimer.duration, progressLineWidth]);

    // const [showTickPointer, setShowTickPointer] = useState(false);
    useEffect(() => {
        if ((vibrationPoints.includes(elapsedTime * 1000))) {
            Vibration.vibrate(pattern);
        }
        if ((elapsedTime * 1000) >= newTimer.duration) {
            Vibration.vibrate(4500);
        }
    }, [elapsedTime, vibrationPoints, pattern]);
    const vibrationPoints = useMemo(() => {
        const vibrations = newTimer.breakPoints.map(breakpoint => breakpoint.endAt);
        return vibrations;
    }, [newTimer.breakPoints]);

    // ========== Render ========== //
    const progressLineWidth = 2000;
    const [progressLineTotalLength, setProgressLineTotalLength] = useState(0);
    const scrollViewRef = useRef(null);
    const lineGap = 6;
    const lineWidth = 2;
    useEffect(() => {
        if (vibrationPoints && vibrationPoints.length > 0) {
            // Calculate the total number of lines
            const totalLines = Math.ceil(progressLineWidth / lineGap);

            // Calculate the total length
            const totalLength = totalLines * lineWidth + (totalLines - 1) * lineGap;
            setProgressLineTotalLength(totalLength);
        }
    }, [vibrationPoints, lineGap, lineWidth, progressLineWidth]);

    const progressTimeLine = (length, lineGap, lineWidth, lineHeight, elapsedTime) => {

        if (vibrationPoints && vibrationPoints.length > 0) {
            const lines = [];

            // Calculate the total number of lines
            const totalLines = Math.ceil(length / lineGap);

            // Calculate milliseconds per line
            const msPerLine = newTimer.duration / totalLines;

            for (let i = 0; i < totalLines; i++) {
                const startTimeForThisLine = msPerLine * i;
                const endTimeForThisLine = startTimeForThisLine + msPerLine;

                let isVibrationLine = vibrationPoints.some(point =>
                    point >= startTimeForThisLine && point < endTimeForThisLine
                );
                let hasPassed = elapsedTime * 1000 >= startTimeForThisLine;

                if (i === totalLines - 1) {
                    isVibrationLine = true;
                }

                lines.push(
                    <View
                        key={i}
                        style={{
                            width: lineWidth,
                            height: isVibrationLine ? lineHeight + 30 : lineHeight,
                            backgroundColor: (isVibrationLine || hasPassed) ? colors.red : colors.Gray3,
                            marginLeft: i === 0 ? 0 : lineGap,
                        }}
                    />
                );
            }
            return lines;
        }
    };

    const blockHeightThreshold = 300000;
    const blockHeightRatio = 5000;

    return (
        <View style={styles.container}>
            {countdown !== null && (
                <View style={styles.fullScreenOverlay}>
                    <Text style={styles.countdownText}>{countdown}</Text>
                </View>
            )}
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
                                        (breakpoint.startAt < elapsedTime * 1000)
                                        && (breakpoint.endAt < elapsedTime * 1000
                                            ? { backgroundColor: colors.smokeWhite }
                                            : { backgroundColor: colors.lightRed }),
                                        { height: breakpoint.duration > blockHeightThreshold ? breakpoint.duration / blockHeightRatio : 60 },
                                        { justifyContent: breakpoint.duration > blockHeightThreshold ? 'flex-start' : 'center' }
                                    ]}
                                >
                                    <Text style={[
                                        styles.breakPointText,
                                        (breakpoint.startAt < elapsedTime * 1000)
                                        && (breakpoint.endAt < elapsedTime * 1000
                                            ? { color: colors.black }
                                            : { color: colors.red })
                                    ]}>{formatDuration(breakpoint.duration)}</Text>
                                </View>
                            </View>
                            <View style={styles.breakPointLineContainer}>
                                <View style={[styles.breakPointIndicator, (breakpoint.endAt < elapsedTime * 1000) && { backgroundColor: colors.red }]}>
                                    {breakpoint.endAt >= newTimer.duration ?
                                        (
                                            <Text style={[styles.breakPointIndicatorText, (breakpoint.endAt < elapsedTime * 1000) && { color: colors.white }]}>
                                                End
                                            </Text>
                                        ) : (
                                            <Text style={[styles.breakPointIndicatorText, (breakpoint.endAt < elapsedTime * 1000) && { color: colors.white }]}>
                                                {formatDuration(breakpoint.endAt)}
                                            </Text>
                                        )
                                    }
                                </View>
                                <View style={styles.lineContainer}>
                                    <DashedLine dashWidth={5} dashGap={5} dashColor={(breakpoint.endAt < elapsedTime * 1000) ? colors.red : colors.black} />
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
                                <View style={[styles.breakPointIndicator, (newTimer.duration <= elapsedTime * 1000) && { backgroundColor: colors.red }]}>
                                    <Text style={[styles.breakPointIndicatorText, (newTimer.duration <= elapsedTime * 1000) && { color: colors.white }]}>
                                        End
                                    </Text>
                                </View>
                                <View style={styles.lineContainer}>
                                    <DashedLine dashWidth={5} dashGap={5} dashColor={(newTimer.duration <= elapsedTime * 1000) ? colors.red : colors.black} />
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                {playMode !== 'stop' &&
                    (<View style={styles.editingContainer}>
                        <View style={[styles.elapsedTimeContainer, elapsedTime > 0 && { opacity: 1 }]}>
                            <Text style={styles.elapsedTimeText}>
                                {formatDurationToNumeric(elapsedTime * 1000)}
                            </Text>
                        </View>
                        <ScrollView
                            ref={scrollViewRef}
                            contentContainerStyle={[styles.progressLineContainer, { paddingRight: 2000 }]}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}
                        >
                            <View style={styles.progressLineSrollArea}>
                                {progressTimeLine(progressLineWidth, lineGap, lineWidth, 40, elapsedTime)}
                            </View>
                        </ScrollView>
                    </View>)}
                <View style={styles.bottomButtonContainer}>
                    {playMode === 'stop' && (
                        <TouchableOpacity style={[styles.bottomButton, { backgroundColor: colors.black }]} onPress={handlePlay}>
                            <FontAwesomeIcon icon={faPlay} size={21} color={colors.white} />
                        </TouchableOpacity>
                    )}
                    {(playMode === 'play' || playMode === 'continue') && (
                        <TouchableOpacity style={[styles.bottomButton, { backgroundColor: colors.lightRed }]} onPress={handlePause}>
                            <FontAwesomeIcon icon={faPause} size={21} color={colors.red} />
                        </TouchableOpacity>
                    )}
                    {playMode === 'pause' && (
                        <View style={{ flex: 1, flexDirection: 'row', columnGap: 10 }}>
                            <TouchableOpacity style={[styles.stopButton, { backgroundColor: colors.Gray1 }]} onPress={handleStop}>
                                <FontAwesomeIcon icon={faStop} size={21} color={colors.black} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.bottomButton, { backgroundColor: colors.black }]} onPress={handleContinue}>
                                <FontAwesomeIcon icon={faForward} size={21} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                    )}
                    {playMode === 'restart' && (
                        <View style={{ flex: 1, flexDirection: 'row', columnGap: 10 }}>
                            <TouchableOpacity style={[styles.stopButton, { backgroundColor: colors.Gray1 }]} onPress={handlePlay}>
                                <FontAwesomeIcon icon={faRotateRight} size={21} color={colors.black} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.bottomButton, { backgroundColor: colors.Gray1 }]} onPress={handleStop}>
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
