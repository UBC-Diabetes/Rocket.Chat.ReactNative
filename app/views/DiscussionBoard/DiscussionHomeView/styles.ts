import { StyleSheet } from 'react-native';

const makeStyles = themeColors =>
	StyleSheet.create({
		mainContainer: {
			flex: 1,
			alignItems: 'center',
			backgroundColor: themeColors.backgroundColor
		},
		discussionBoardsSeparator: {
			height: 1,
			width: '100%',
			backgroundColor: '#0000004D',
			marginVertical: 16
		},
		footer: {
			height: 80
		}
	});

export default makeStyles;
