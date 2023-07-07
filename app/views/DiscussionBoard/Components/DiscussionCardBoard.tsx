import React from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';

import { themes } from '../../../lib/constants';
import { useTheme, withTheme } from '../../../theme';
import { DiscussionBoardCardProps } from '../DiscussionHomeView/interaces';
import { getIcon } from '../helpers';

const hitSlop = { top: 10, right: 10, bottom: 10, left: 10 };

const DiscussionBoardCard: React.FC<DiscussionBoardCardProps> = ({
	title,
	description,
	saved = false,
	icon,
	color,
	onSaveClick,
	onPress
}) => {
	const [savedDiscussion, setSavedDiscussion] = React.useState(saved);
	const { theme } = useTheme();

	return (
		<TouchableOpacity style={styles.mainContainer} onPress={() => onPress && onPress()}>
			<View style={[styles.iconContainer, color && { backgroundColor: themes[theme][color] }]}>
				{icon && <Image source={getIcon(icon)} style={styles.icon} resizeMode='contain' />}
			</View>
			<View style={styles.textContainer}>
				<Text style={styles.title}>{title}</Text>
				<Text style={styles.description}>{description}</Text>
			</View>
			<TouchableOpacity
				style={styles.savedContainer}
				onPress={() => {
					setSavedDiscussion(!savedDiscussion);
					onSaveClick && onSaveClick();
				}}
				hitSlop={hitSlop}
			>
				<Image source={savedDiscussion ? getIcon('solidStar') : getIcon('outlineStar')} style={styles.saveIcon} />
			</TouchableOpacity>
		</TouchableOpacity>
	);
};

export default withTheme(DiscussionBoardCard);

const styles = StyleSheet.create({
	mainContainer: {
		width: '100%',
		flexDirection: 'row'
	},
	iconContainer: {
		borderRadius: 10,
		height: 80,
		width: 80,
		justifyContent: 'center',
		alignItems: 'center'
	},
	icon: {
		width: 38,
		height: 38
	},
	textContainer: {
		flex: 1,
		paddingTop: 6,
		marginLeft: 12,
		marginRight: 15
	},
	title: {
		fontFamily: 'Inter',
		fontWeight: '500',
		fontSize: 16,
		lineHeight: 19
	},
	description: {
		fontFamily: 'Inter',
		fontWeight: '400',
		fontSize: 12,
		lineHeight: 15,
		marginTop: 4
	},
	savedContainer: {
		width: 42,
		height: 42,
		marginTop: 10,
		justifyContent: 'center',
		alignItems: 'center'
	},
	saveIcon: {
		width: 42,
		height: 42
	}
});
