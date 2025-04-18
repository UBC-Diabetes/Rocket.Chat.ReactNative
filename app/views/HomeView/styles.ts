import { Dimensions, StyleSheet } from 'react-native';

import { colors } from '../../lib/constants';

export const createMainStyles = ({ theme }: { theme: any }) =>
	StyleSheet.create({
		mainContainer: {
			backgroundColor: colors[theme].backgroundColor,
			flex: 1,
			padding: 20
		},
		title: {
			fontSize: 24,
			lineHeight: 29,
			fontWeight: '600',
			color: colors[theme].fontSecondaryInfo
		},
		tileContainer: {
			flexDirection: 'row',
			justifyContent: 'space-around',
			flexWrap: 'wrap'
		},
		profileImageContainer: {
			marginRight: 20
		},
		profileImage: {
			// width: 24,
			// height: 24,
			borderRadius: 12
			// backgroundColor: 'red'
		}
	});

const screenWidth = Dimensions.get('window').width;

const isLargeMobileScreen = screenWidth > 390;

const smallTileWidth = isLargeMobileScreen ? 115 : 96;

export const createTileStyles = ({
	size,
	color,
	maxTileWidth,
	theme
}: {
	size?: 'small' | 'large';
	color: string;
	maxTileWidth?: number;
	theme: any;
}) =>
	StyleSheet.create({
		tile: {
			width: size === 'small' ? smallTileWidth : 130,
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
			backgroundColor: color
		},
		text: {
			fontSize: 16,
			lineHeight: 19,
			textAlign: 'center',
			fontWeight: '500',
			marginTop: size === 'small' ? 14 : 16,
			color: colors[theme].fontSecondaryInfo
		},
		smallImage: {
			width: 45,
			height: 45
		},
		largeImage: {
			width: 75,
			height: 75
		}
	});
