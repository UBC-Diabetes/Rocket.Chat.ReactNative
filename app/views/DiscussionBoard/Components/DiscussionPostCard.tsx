import React, { useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { withTheme } from '../../../theme';
import { SavedPostCardProps } from '../DiscussionHomeView/interaces';
import { getIcon } from '../helpers';

const hitSlop = { top: 10, right: 10, bottom: 10, left: 10 };

const DiscussionPostCard: React.FC<SavedPostCardProps> = props => {
	const {
		user: { name, profile_image },
		date,
		title,
		description,
		image,
		likes,
		comments,
		saved = false,
		onSaveClick,
		onPress
	} = props;

	const [isSaved, setIsSaved] = useState(saved);

	return (
		<TouchableOpacity style={styles.container} onPress={() => onPress && onPress()}>
			<View style={styles.header}>
				<Image source={{ uri: profile_image }} style={styles.profileImage} />
				<View style={styles.headerTextContainer}>
					<Text style={styles.nameText}>{name}</Text>
					<Text style={styles.dateText}>{date}</Text>
				</View>
				<TouchableOpacity
					onPress={() => {
						setIsSaved(!isSaved);
						onSaveClick && onSaveClick();
					}}
					hitSlop={hitSlop}
				>
					<Image source={isSaved ? getIcon('solidSave') : getIcon('outlineSave')} style={styles.saveIcon} resizeMode='contain' />
				</TouchableOpacity>
			</View>
			{image && <Image source={{ uri: image }} style={styles.bannerImage} resizeMode='cover' />}
			<View style={styles.textContainer}>
				<Text style={styles.title}>{title}</Text>
				<Text style={styles.description}>{description}</Text>
			</View>
			<View style={styles.actionContainer}>
				<View style={styles.buttonContainer}>
					<Image source={getIcon('like')} style={styles.postReaction} />
					<Text style={styles.postReactionText}>{likes}</Text>
					<View style={{ width: 24 }} />
					<Image source={getIcon('comment')} style={styles.postReaction} />
					<Text style={styles.postReactionText}>{comments}</Text>
				</View>
				<TouchableOpacity hitSlop={hitSlop}>
					<Image source={getIcon('arrowRight')} style={styles.arrow} resizeMode='contain' />
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
};

export default withTheme(DiscussionPostCard);

const styles = StyleSheet.create({
	container: {
		width: '100%',
		elevation: 1,
		backgroundColor: '#fff',
		padding: 20,
		borderRadius: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.05,
		shadowRadius: 30
	},
	header: {
		flexDirection: 'row',
		marginBottom: 12.5,
		alignItems: 'center'
	},
	profileImage: {
		width: 34,
		height: 34,
		borderRadius: 17,
		justifyContent: 'center',
		alignItems: 'center'
	},
	headerTextContainer: {
		marginLeft: 12,
		flex: 1
	},
	nameText: {
		fontSize: 14,
		lineHeight: 20,
		fontWeight: '400'
	},
	dateText: {
		fontSize: 12,
		lineHeight: 15,
		fontWeight: '400',
		color: '#00000080'
	},
	saveIcon: {
		width: 18,
		height: 18
	},
	postReaction: {
		height: 14,
		width: 14
	},
	postReactionText: {
		fontSize: 10,
		lineHeight: 12,
		fontWeight: '400',
		marginLeft: 6
	},
	bannerImage: {
		borderRadius: 20,
		height: 160,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	arrow: {
		height: 15,
		width: 15
	},
	textContainer: {
		paddingTop: 6,
		marginVertical: 10
	},
	title: {
		fontFamily: 'Inter',
		fontWeight: '500',
		fontSize: 16,
		lineHeight: 19,
		color: '#000000'
	},
	description: {
		fontFamily: 'Inter',
		fontWeight: '400',
		fontSize: 12,
		lineHeight: 15,
		marginTop: 4,
		color: '#000000b3'
	},
	actionContainer: {
		width: '100%',
		height: 33,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	buttonContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	}
});
