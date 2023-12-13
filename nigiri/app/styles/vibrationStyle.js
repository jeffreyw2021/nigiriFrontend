import { StyleSheet } from 'react-native';
import colors from './colors';
import fontSize from './fontSize';

const styles = StyleSheet.create({
    vibrationContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal:20,
        paddingVertical:12,
        rowGap: 12,
    },
    buttonContainer:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topButton:{
        paddingVertical: 10,
    },
    buttonText:{
        fontSize: fontSize.large,
        fontWeight: '500',
        color: colors.black,
    },  
    selectionContainer:{
        width: '100%',
        borderRadius: 12,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: colors.smokeWhite,
    },
    selectionRow:{
        width: '100%',
        padding:16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomColor: colors.Gray1,
        columnGap: 10,
        borderBottomWidth: 1,
    },
    selectionTitle:{
        fontSize: fontSize.medium,
        color: colors.black,
    },
    selectionRadio:{
        width: 18,
        height: 18,
        padding: 2,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.darkGray,
    },
    selectionRadioActive:{
        flex:1,
        borderRadius: 10,
        backgroundColor: colors.black,
    }
});

export default styles;