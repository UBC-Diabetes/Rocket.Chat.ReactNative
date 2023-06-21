import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';

import * as HeaderButton from '../../../containers/HeaderButton';
import { useTheme, withTheme } from '../../../theme';
import { IApplicationState } from '../../../definitions';
import { themes } from '../../../lib/constants';
import EventEmitter from '../../../lib/methods/helpers/events';
import { LISTENER } from '../../../containers/Toast';
import styles from './styles';

const bannerImage = 'https://images.pexels.com/photos/837745/pexels-photo-837745.jpeg?auto=compress&cs=tinysrgb&w=1600';
const profileImage =
	'https://marketplace.canva.com/EAFEits4-uw/1/0/800w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-r0bPCSjUqg0.jpg';

const moreIcon = require('../../../static/images/discussionboard/more.png');
const likeIcon = require('../../../static/images/discussionboard/like.png');
const commentCountIcon = require('../../../static/images/discussionboard/comment.png');

const PostView: React.FC = () => {
	const navigation = useNavigation<StackNavigationProp<any>>();

	const isMasterDetail = useSelector((state: IApplicationState) => state.app.isMasterDetail);
	const { theme } = useTheme();

	useEffect(() => {
		navigation.setOptions({ title: '', headerStyle: { shadowColor: 'transparent' } });
		if (!isMasterDetail) {
			navigation.setOptions({
				headerLeft: () => (
					<TouchableOpacity
						style={{ marginLeft: 20 }}
						onPress={() => {
							navigation.goBack();
						}}
					>
						<Image
							source={require('../../../static/images/discussionboard/arrow_left.png')}
							style={{ width: 11, height: 19 }}
							resizeMode='contain'
						/>
					</TouchableOpacity>
				),
				headerRight: () => (
					<View style={{ marginRight: 8 }}>
						<HeaderButton.Container>
							<HeaderButton.Item
								iconName='search'
								color={themes[theme].superGray}
								onPress={() => {
									EventEmitter.emit(LISTENER, { message: `Open search` });
								}}
							/>
						</HeaderButton.Container>
					</View>
				)
			});
		}
	});

	const getDate = () => {
		const date = moment().format('MMMM D, YYYY - h:MMa');
		return date;
	};

	const comment = () => (
		<View style={styles.comment}>
			<View style={styles.commentHeader}>
				<Image source={{ uri: profileImage }} style={styles.commentProfileImage} />
				<View style={styles.commentUsernameContainer}>
					<Text style={styles.commentUsername}>Tom Princess</Text>
				</View>
				<View style={styles.commentOptions}>
					<Image source={moreIcon} style={styles.commentOptionsIcon} resizeMode='contain' />
				</View>
			</View>
			<Text style={styles.commentText}>Im scared to travel! It’s too much of a burden on my immune system.</Text>
			<View style={styles.commentFooter}>
				<Text style={styles.commentDate}>{getDate()}</Text>
				<View style={styles.commentReactions}>
					<Image style={styles.commentReactionIcon} source={likeIcon} resizeMode='contain' />
					<Text style={styles.commentReactionText}>12</Text>
				</View>
			</View>
		</View>
	);

	const commentSection = () => (
		<View style={styles.commentsContainer}>
			<Text style={styles.commentsTitle}>Comments</Text>
			{comment()}
			{comment()}
			{comment()}
		</View>
	);

	return (
		<ScrollView style={styles.mainContainer}>
			<View style={styles.addCommentContainer}>
				<Text style={{ fontSize: 12 }}>add comment</Text>
			</View>
			<View style={styles.header}>
				<Image source={{ uri: profileImage }} style={styles.profileImage} />
				<View style={styles.profileNameContainer}>
					<Text style={styles.profileName}>Tom Princess</Text>
				</View>
				<TouchableOpacity>
					<Image source={moreIcon} style={styles.moreMenuIcon} resizeMode='contain' />
				</TouchableOpacity>
			</View>
			<View style={styles.content}>
				<Image source={{ uri: bannerImage }} style={styles.banner} />
				<Text style={styles.title}>Thoughts on Exercising with TDI?</Text>
				<Text style={styles.description}>
					I wanted to start a discussion thread for us to share traveling tips fro T1D. Here’s a few I came up with of the top of
					my head:
				</Text>
				<Text style={styles.postDate}>{getDate()}</Text>
			</View>
			<View style={styles.reactions}>
				<Image style={styles.icon} source={likeIcon} resizeMode='contain' />
				<Text style={styles.reactionText}>2</Text>
				<Image style={styles.icon} source={commentCountIcon} resizeMode='contain' />
				<Text style={styles.reactionText}>5</Text>
			</View>
			{commentSection()}
		</ScrollView>
	);
};

export default withTheme(PostView);
