import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/homeStyle';
import colors from '../styles/colors';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>
                    Click the “+” button to Create a new timer
                </Text>
            </View>
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
