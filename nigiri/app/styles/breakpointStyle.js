import { StyleSheet, Dimensions} from 'react-native';
import colors from './colors';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    breakpointContainer:{
        flex: 1,
        paddingHorizontal: 30,
        paddingTop:80,
        paddingBottom: 115,
        backgroundColor: colors.white,
        rowGap: 22,
    },
    breakpointTitleContainer:{
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    breakpointTitle:{
        color: colors.Gray3,
        fontSize: 20,
        fontWeight: '600',
    },

    breakpointBodyContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    AddFirstBreakpoint:{
        width: '100%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.Gray1,
        borderRadius: 12,
    },


    bottomButtonContainer: {
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        position: 'absolute',
        columnGap: 10,
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 30,
        paddingTop: 12,
        paddingBottom: 60,
        backgroundColor: colors.white,
        shadowColor: '#333',
        shadowOffset: { width: 0, height: -1 }, 
        shadowOpacity: 0.10, 
        shadowRadius: 2,
        elevation: 3,
    },
    bottomButton:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: colors.Gray1,
        borderRadius: 8,
    },
    bottomButtonText:{
        color: colors.black,
        fontSize: 18,
    },
});

export default styles;