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
	Keyboard,
	Dimensions,
	Alert
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';

import * as HeaderButton from '../../../containers/HeaderButton';
import { useTheme, withTheme } from '../../../theme';
import { IApplicationState, TAnyMessageModel, TThreadMessageModel, TThreadModel } from '../../../definitions';
import { themes } from '../../../lib/constants';
import styles from './styles';
import { comments } from '../data';
import PostOptionsModal from './PostOptions';
import PostDeleteModal from './PostDelete';
import PostReportModal from './PostReport';
import { DeleteType, ReportType, CommentProps } from './interfaces';
import { getIcon } from '../helpers';
import Markdown from '../../../containers/markdown';
import Avatar from '../../../containers/Avatar/Avatar';
import { formatAttachmentUrl } from '../../../lib/methods/helpers';
import { getUserSelector } from '../../../selectors/login';
import database from '../../../lib/database';
import { readThreads } from '../../../lib/services/restApi';
import { getThreadMessageById } from '../../../lib/database/services/ThreadMessage';
import { Services } from '../../../lib/services';
import { showToast } from '../../../lib/methods/helpers/showToast';

const hitSlop = { top: 10, right: 10, bottom: 10, left: 10 };
const baseUrl = 'https://app.t1dreachout.com';

const PostView: React.FC = ({ route }) => {
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

	const [ownPost, setOwnPost] = useState(false);

	const user = useSelector((state: IApplicationState) => getUserSelector(state));
	const customEmojis = useSelector((state: IApplicationState) => state.customEmojis);
	const server = useSelector((state: IApplicationState) => state.server.server);
	const isMasterDetail = useSelector((state: IApplicationState) => state.app.isMasterDetail);
	// const { theme } = useTheme();
	const theme = 'light';

	const [postUser, setPostUser] = useState(null);
	const [post, setPost] = useState(null);
	const [bannerImage, setBannerImage] = useState(null);
	const [description, setDescription] = useState(null);
	const [bannerHeight, setBannerHeight] = useState(100);
	const [reportReason, setReportReason] = useState(null);

	const ImageProgress = createImageProgress(FastImage);
	useEffect(async () => {
		const post = route.params?.item;
		if (post) {
			console.log('post ---------------------------- ', post, user);
			setPostUser(post._raw.u);
			setPost(post._raw);
			setDescription(post?._raw?.msg);
			const attachments = post?._raw?.attachments;
			if (typeof attachments !== 'string' && attachments?.length > 0) {
				const banner = formatAttachmentUrl(attachments[0].image_url, user.id, user.token, baseUrl);
				setBannerImage(banner);
				setDescription(attachments[0].description);
				Image.getSize(banner, (width, height) => {
					const bannerContainerWidth = Dimensions.get('window').width - 40;
					const bannerContainerHeight = (bannerContainerWidth * height) / width;
					setBannerHeight(bannerContainerHeight);
				});
			}
			if (post?._raw?.u?._id === user.id) {
				setOwnPost(true);
			}
			loadComments();
		}
	}, [route.params]);

	const getCustomEmoji = name => {
		const emoji = customEmojis[name];
		if (emoji) {
			return emoji;
		}
		return null;
	};

	const loadComments = async () => {
		console.log('comments ------------');

		const post = route.params?.item._raw;

		const replyArray = post.replies;
		console.log('replyArray ------------', replyArray);

		// // Array to store the responses
		const comments: (TThreadMessageModel | null)[] = [];
		const db = database.active;

		// Loop through the array and make API calls with each id
		const apiCalls = replyArray.map(async id => {
			try {
				// const response = await getThreadMessageById(id);
				// console.log(`API call with ${id} succeeded:`, response);
				// comments.push(response); // Collect the response in the array
				// let thread = await db.get('threads').find(id);
				let thread = await db.get('threads');
				let messages = await db.get('messages').find(post.id);
				let messagesx = await db.get('messages').find(id);

				console.log('thread', thread);
				console.log('messages', messages);
				console.log('messagesx', messagesx);

				// const res = await Services.readThreads(id)
				// console.log(`API call with ${id} succeeded:2`, res);
			} catch (error) {
				console.error(`API call with ${id} failed:`, error);
				throw error; // You can rethrow the error or handle it differently
			}
		});

		// Wait for all API calls to finish using Promise.all
		await Promise.all(apiCalls);

		console.log('All API calls completed.');
		console.log('Responses Array:', comments); // Array of all responses

		// // return comments; // If you want to use the comments array outside of this function
		// const room = route.params?.item;
		// await loadMissedMessages({ rid: room.rid, lastOpen: moment().subtract(7, 'days').toDate() });
		// setLoading(true);

		// let count = QUERY_SIZE;
		// let thread: TThreadModel | null = null;
		// let messagesObservable;
		// // const { rid, sys_mes, tmid } = room;
		// // const showMessageInMainThread = user.showMessageInMainThread ?? false;
		// const db = database.active;

		// // handle servers with version < 3.0.0
		// // let hideSystemMessages = Array.isArray(sys_mes) ? sys_mes : Hide_System_Messages || [];
		// // if (!Array.isArray(hideSystemMessages)) {
		// // 	hideSystemMessages = [];
		// // }

		// if (tmid) {
		// 	try {
		// 		thread = await db.get('threads').find(tmid);
		// 	} catch (e) {
		// 		// console.log(e);
		// 	}
		// 	messagesObservable = db
		// 		.get('thread_messages')
		// 		.query(Q.where('rid', tmid), Q.experimentalSortBy('ts', Q.desc), Q.experimentalSkip(0), Q.experimentalTake(count))
		// 		.observe();
		// }
	};

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
		return moment(date) ? formattedDate : '';
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
				{description ? (
					<Markdown
						msg={description}
						// style={[isReply && style]}
						style={[styles.description]}
						username={postUser?.username}
						getCustomEmoji={getCustomEmoji}
						theme={theme}
					/>
				) : null}
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

	const handleReport = async () => {
		try {
			if (post?.id) {
				console.log('message', post);
				await Services.reportMessage(post.id, reportReason);
				Alert.alert('Post Reported');
			}
		} catch (e) {
			console.error(e);
		}
	};

	const handleDelete = async () => {
		const message = post;
		try {
			// logEvent(events.ROOM_MSG_ACTION_DELETE);
			if (message) {
				console.log('message', message);

				await Services.deleteMessage(message.id, message.rid);
			}
		} catch (e) {
			// logEvent(events.ROOM_MSG_ACTION_DELETE_F);

			console.error(e);
		}
	};

	return (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
			<View style={styles.mainContainer}>
				<ScrollView showsVerticalScrollIndicator={false} ref={scrollviewRef}>
					<View onLayout={onPostLayout} style={styles.postContainer}>
						<View style={styles.header}>
							{postUser?.username ? (
								<Avatar text={postUser?.username} style={styles.profileImage} size={24} server={server} borderRadius={12} />
							) : (
								<></>
							)}
							<View style={styles.profileNameContainer}>
								<Text style={styles.profileName}>{post?.u?.name ?? ''}</Text>
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
							{/* <Image source={{ uri: bannerImage }} style={styles.banner} /> */}
							{bannerImage && (
								<ImageProgress
									style={[styles.banner, { height: bannerHeight }]}
									source={{ uri: encodeURI(bannerImage) }}
									resizeMode={FastImage.resizeMode.cover}
									indicator={Progress.Pie}
									indicatorProps={{
										color: themes[theme].actionTintColor
									}}
								/>
							)}
							{/* <Text style={styles.title}>Thoughts on Exercising with TDI?</Text> */}
							{description ? (
								<Markdown
									msg={description}
									// style={[isReply && style]}
									// style={[styles.description]}
									username={postUser?.username}
									getCustomEmoji={getCustomEmoji}
									theme={theme}
								/>
							) : (
								<></>
							)}
							<Text style={styles.postDate}>{getDate(post?.ts)}</Text>
						</View>
						<View style={styles.reactions}>
							<TouchableOpacity onPress={() => {}} style={{ flexDirection: 'row', alignItems: 'center' }} hitSlop={hitSlop}>
								<Image style={styles.icon} source={getIcon('like')} resizeMode='contain' />
								<Text style={styles.reactionText}>
									{typeof post?.reactions !== 'string' && post?.reactions?.length > 0 ? post.reactions.length : '0'}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => scrollCommentsToTop()}
								style={{ flexDirection: 'row', alignItems: 'center' }}
								hitSlop={hitSlop}
							>
								<Image style={styles.icon} source={getIcon('comment')} resizeMode='contain' />
								<Text style={styles.reactionText}>
									{typeof post?.replies !== 'string' && post?.replies?.length > 0 ? post.replies.length : '0'}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					{/* {commentSection()} */}
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
				delete={() => {
					handleDelete();
					setShowDeleteModal(false);
				}}
			/>
			<PostReportModal
				type={reportType}
				show={showReportModal}
				close={() => setShowReportModal(false)}
				report={() => {
					handleReport();
					setShowReportModal(false);
				}}
				onText={e => {
					setReportReason(e);
				}}
			/>
		</KeyboardAvoidingView>
	);
};

export default withTheme(PostView);
