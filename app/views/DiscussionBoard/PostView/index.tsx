import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	ScrollView,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	Keyboard
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';

import * as HeaderButton from '../../../containers/HeaderButton';
import { useTheme, withTheme } from '../../../theme';
import { IApplicationState } from '../../../definitions';
import { themes } from '../../../lib/constants';
import styles from './styles';
import { comments } from '../data';
import PostOptionsModal from './PostOptions';
import PostDeleteModal from './PostDelete';
import PostReportModal from './PostReport';
import { DeleteType, ReportType, CommentProps } from './interfaces';
import { getIcon } from '../helpers';

const bannerImage = 'https://images.pexels.com/photos/837745/pexels-photo-837745.jpeg?auto=compress&cs=tinysrgb&w=1600';
const profileImage =
	'https://marketplace.canva.com/EAFEits4-uw/1/0/800w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-r0bPCSjUqg0.jpg';

const hitSlop = { top: 10, right: 10, bottom: 10, left: 10 };

const PostView: React.FC = () => {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const [newComment, setNewComment] = useState('');
	const [textinputHeight, setTextinputHeight] = useState(0);
	const [showCommentOptionsModal, setShowCommentOptionsModal] = useState(false);
	const [selectedComment, setSelectedComment] = useState({} as CommentProps);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [deleteType, setDeleteType] = useState(DeleteType.COMMENT);
	const [showReportModal, setShowReportModal] = useState(false);
	const [reportType, setReportType] = useState(ReportType.COMMENT);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const [postHeight, setPostHeight] = useState(0);

	const textInputRef = useRef(null);
	const scrollviewRef = useRef(null);
	const commentsRef = useRef(null);

	const ownPost = true;

	const isMasterDetail = useSelector((state: IApplicationState) => state.app.isMasterDetail);
	const { theme } = useTheme();

	useEffect(() => {
		navigation.setOptions({ title: '', headerStyle: { shadowColor: 'transparent' } });
		if (!isMasterDetail) {
			navigation.setOptions({
				headerLeft: () => (
					<TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.goBack()}>
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
								onPress={() => navigation.navigate('DiscussionSearchView')}
							/>
						</HeaderButton.Container>
					</View>
				)
			});
		}
	});

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event: any) => {
			setKeyboardHeight(event.endCoordinates.height);
		});
		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			setKeyboardHeight(0);
		});

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	const getDate = (date: string, format?: string) => {
		const formattedDate = moment(date).format(format ?? 'MMMM D, YYYY - h:MMa');
		return formattedDate;
	};

	const likeComment = (item: CommentProps) => {
		console.log('like comment by ', item?.user?.name);
	};

	const comment = (item: CommentProps, key: number) => {
		const {
			user: { name, profile_image },
			date,
			description,
			likes
		} = item;

		return (
			<View style={styles.comment} key={key}>
				<View style={styles.commentHeader}>
					<Image source={{ uri: profile_image }} style={styles.commentProfileImage} />
					<View style={styles.commentUsernameContainer}>
						<Text style={styles.commentUsername}>{name}</Text>
					</View>
					<TouchableOpacity
						style={styles.commentOptions}
						onPress={() => {
							setSelectedComment(item);
							setShowCommentOptionsModal(!showCommentOptionsModal);
						}}
					>
						<Image source={getIcon('more')} style={styles.commentOptionsIcon} resizeMode='contain' />
					</TouchableOpacity>
				</View>
				<Text style={styles.commentText}>{description}</Text>
				<View style={styles.commentFooter}>
					<Text style={styles.commentDate}>{getDate(date)}</Text>
					<TouchableOpacity style={styles.commentReactions} onPress={() => likeComment(item)} hitSlop={hitSlop}>
						<Image style={styles.commentReactionIcon} source={getIcon('like')} resizeMode='contain' />
						<Text style={styles.commentReactionText}>{likes}</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	};

	const commentSection = () => (
		<View ref={commentsRef}>
			<Text style={styles.commentsTitle}>Comments</Text>
			{comments.map((item, key) => comment(item, key))}
		</View>
	);

	const scrollCommentsToTop = () => {
		scrollviewRef?.current?.scrollTo({ y: postHeight, animated: true });
	};

	const onLayoutFooter = (event: any) => {
		const { height } = event.nativeEvent.layout;
		setTextinputHeight(height);
	};

	const onPostLayout = (event: any) => {
		const { height } = event.nativeEvent.layout;
		setPostHeight(height);
	};

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
			<View style={styles.mainContainer}>
				<ScrollView showsVerticalScrollIndicator={false} ref={scrollviewRef}>
					<View onLayout={onPostLayout} style={styles.postContainer}>
						<View style={styles.header}>
							<Image source={{ uri: profileImage }} style={styles.profileImage} />
							<View style={styles.profileNameContainer}>
								<Text style={styles.profileName}>Tom Princess</Text>
							</View>
							<TouchableOpacity
								onPress={() => {
									if (ownPost) {
										setDeleteType(DeleteType.POST);
										setShowDeleteModal(true);
									} else {
										setReportType(ReportType.POST);
										setShowReportModal(true);
									}
								}}
								hitSlop={hitSlop}
							>
								<Image source={getIcon('more')} style={styles.moreMenuIcon} resizeMode='contain' />
							</TouchableOpacity>
						</View>
						<View style={styles.content}>
							<Image source={{ uri: bannerImage }} style={styles.banner} />
							<Text style={styles.title}>Thoughts on Exercising with TDI?</Text>
							<Text style={styles.description}>
								I wanted to start a discussion thread for us to share traveling tips fro T1D. Here’s a few I came up with of the
								top of my head:
							</Text>
							<Text style={styles.postDate}>{getDate(new Date().toString())}</Text>
						</View>
						<View style={styles.reactions}>
							<TouchableOpacity onPress={() => {}} style={{ flexDirection: 'row', alignItems: 'center' }} hitSlop={hitSlop}>
								<Image style={styles.icon} source={getIcon('like')} resizeMode='contain' />
								<Text style={styles.reactionText}>2</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									// textInputRef.current?.focus();
									// commentsRef.current?.
									scrollCommentsToTop();
								}}
								style={{ flexDirection: 'row', alignItems: 'center' }}
								hitSlop={hitSlop}
							>
								<Image style={styles.icon} source={getIcon('comment')} resizeMode='contain' />
								<Text style={styles.reactionText}>5</Text>
							</TouchableOpacity>
						</View>
					</View>
					{commentSection()}
					<View style={{ height: textinputHeight }} />
				</ScrollView>
			</View>
			{!showCommentOptionsModal && (
				<View style={{ ...styles.addCommentContainer, paddingBottom: keyboardHeight + 33 }} onLayout={onLayoutFooter}>
					<View style={styles.textInputContainer}>
						<TextInput
							ref={textInputRef}
							style={styles.textInput}
							value={newComment}
							placeholder={'Add a comment ...'}
							placeholderTextColor='#000000b3'
							onChangeText={text => {
								console.log(text);
								setNewComment(text);
							}}
							multiline
							maxLength={2000}
							underlineColorAndroid='transparent'
						/>
						<TouchableOpacity
							onPress={() => {
								// send api request to post comment
								Keyboard.dismiss();
							}}
						>
							<Image source={getIcon('send')} style={styles.sendIcon} resizeMode='contain' />
						</TouchableOpacity>
					</View>
				</View>
			)}
			<PostOptionsModal
				show={showCommentOptionsModal}
				comment={selectedComment}
				close={() => setShowCommentOptionsModal(false)}
				onDelete={() => {
					setDeleteType(DeleteType.COMMENT);
					setShowCommentOptionsModal(false);
					setShowDeleteModal(true);
				}}
				onReport={() => {
					setReportType(ReportType.COMMENT);
					setShowReportModal(true);
					setShowCommentOptionsModal(false);
				}}
			/>
			<PostDeleteModal
				show={showDeleteModal}
				type={deleteType}
				close={() => setShowDeleteModal(false)}
				delete={() => setShowDeleteModal(false)}
			/>
			<PostReportModal
				type={reportType}
				show={showReportModal}
				close={() => setShowReportModal(false)}
				report={() => setShowReportModal(false)}
			/>
		</KeyboardAvoidingView>
	);
};

export default withTheme(PostView);
