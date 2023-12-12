import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
        paddingLeft: 30,
        paddingRight: 30,
        backgroundColor: colors.white,
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow: 'scroll',
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
        zIndex: 3,
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

    topButtonContainer:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 65,
        paddingBottom: 10,
        columnGap: 20,
        paddingHorizontal: 4,
    },
    topButtonText:{
        color: colors.black,
        fontSize: 18,
        fontWeight: '600',
    },
    timersContainer: {
        width: '100%',
        height: height,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    timersList: {
        paddingTop: 10,
        width: '100%',
        flexDirection: 'row',
        columnGap: 10,
        rowGap: 10,
        flexWrap: 'wrap',
        paddingBottom: 60,
    },
    timerBlock: {
        width: (width - 70)/2,
        height: (width - 70)/2,
        backgroundColor: colors.smokeWhite,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderRadius: 20,
        padding: 15,
        borderBox: 'box-sizing',
    },
    timerDuration: {
        fontSize: 34,
        fontWeight: '500',
        color: colors.black,
    },
    timerTitle: {
        fontSize: 16,
        fontWeight: '400',
        color: colors.black,
        overflow: 'hidden', 
    },
    

});

export default styles;