import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        paddingLeft: 30,
        paddingRight: 30,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        height: '100%',
        paddingLeft: 50,
        paddingRight: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        textAlign: 'center',
        color: colors.Gray2,
        fontSize: 20,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    button: {
        position: 'absolute',
        width: 80,
        height: 80,
        backgroundColor: colors.black,
        borderRadius: 40,
        borderWidth: 8,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        right: 20,
        bottom: 70
    },
});

export default styles;