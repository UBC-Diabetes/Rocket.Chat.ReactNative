import { StyleSheet } from 'react-native';

import { TColors } from '../../theme';

export const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		paddingVertical: 35,
		paddingHorizontal: 20
	},
	title: {
		fontSize: 24,
		lineHeight: 29,
		fontWeight: '600'
	},
	tileContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		flexWrap: 'wrap'
	}
});

export const createStyles = ({ size, themeColors, color }: { size?: 'small' | 'large'; themeColors: TColors; color?: TColors }) =>
	StyleSheet.create({
		tile: {
			width: size === 'small' ? 96 : 130,
			marginVertical: 16,
			alignItems: 'center'
		},
		tileContent: {
			alignItems: 'center'
		},
		imageContainer: {
			justifyContent: 'center',
			alignItems: 'center',
			width: size === 'small' ? 80 : 130,
			height: size === 'small' ? 80 : 130,
			borderRadius: size === 'small' ? 10 : 65,
			backgroundColor: themeColors[color]
		},
		text: {
			fontSize: 16,
			lineHeight: 19,
			textAlign: 'center',
			fontWeight: '500',
			marginTop: size === 'small' ? 14 : 16
		}
	});
