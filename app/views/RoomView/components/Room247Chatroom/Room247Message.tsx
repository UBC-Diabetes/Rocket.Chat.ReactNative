import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { useTheme } from '../../../../theme';
import MessageContext from '../../../../containers/message/Context';
import { TAnyMessageModel, TGetCustomEmoji, IAttachment } from '../../../../definitions';
import { IRoomInfoParam } from '../../../SearchMessagesView';
import Markdown from '../../../../containers/markdown';
import Attachments from '../../../../containers/message/Components/Attachments';
import styles from './styles';
import { themes } from '../../../../lib/constants';
import Avatar from '../../../../containers/Avatar';
import { CustomIcon } from '../../../../containers/CustomIcon';
import Reactions from '../../../../containers/message/Reactions';
import CustomReactions from './CustomReactions';

// Define reaction interface
interface IReaction {
	_id: string;
	emoji: string;
	usernames: string[];
}

interface IRoom247MessageProps {
	item: TAnyMessageModel;
	user: {
		id: string;
		username: string;
		token: string;
	};
	rid: string;
	timeFormat?: string;
	archived?: boolean;
	broadcast?: boolean;
	previousItem?: TAnyMessageModel;
	baseUrl: string;
	Message_GroupingPeriod?: number;
	isReadReceiptEnabled?: boolean;
	isThreadRoom?: boolean;
	isIgnored?: boolean;
	highlighted?: boolean;
	getCustomEmoji: TGetCustomEmoji;
	onLongPress?: (item: TAnyMessageModel) => void;
	onReactionPress?: (emoji: string, id: string) => void;
	onThreadPress?: (item: TAnyMessageModel) => void;
	showAttachment?: (file: IAttachment) => void;
	navToRoomInfo?: (navParam: IRoomInfoParam) => void;
	isRoom247Chatroom?: boolean;
	autoTranslateRoom?: boolean;
	autoTranslateLanguage?: string;
	// Other props from MessageContainer
	[key: string]: any;
}

// Username color palette
const USERNAME_COLORS = [
	'#00BCD4', // teal/cyan
	'#FF9800', // orange
	'#9C27B0', // purple
	'#4CAF50', // green
	'#F44336', // red
	'#E91E63', // pink
	'#CDDC39', // lime
	'#3F51B5', // deep blue
	'#FFC107', // amber
	'#FF5722' // deep orange
];

// Simple hash function to assign a color index based on username
function getUsernameColor(username: string): string {
	let hash = 0;
	for (let i = 0; i < username.length; i++) {
		hash = username.charCodeAt(i) + ((hash << 5) - hash);
	}
	const index = Math.abs(hash) % USERNAME_COLORS.length;
	return USERNAME_COLORS[index];
}

const Room247Message = (props: IRoom247MessageProps) => {
	const { item, user, previousItem, getCustomEmoji, showAttachment, autoTranslateRoom, autoTranslateLanguage } = props;
	const context = useContext(MessageContext);
	const { theme } = useTheme();

	const isMock = item.id === 'mock-own-message';
	// Check if the message is from the current user
	const isOwn = isMock || item?.u?.username === user?.username;
	const otherUserMessage = item.u?.username !== user?.username;

	// Determine if translation is needed (similar to Message container logic)
	const canTranslateMessage = autoTranslateRoom && autoTranslateLanguage && otherUserMessage;

	// Format timestamp to be used for time display
	const timestamp = item.ts ? new Date(item.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

	// Handle onPress and onLongPress
	const handlePress = () => {
		if (context?.onPress) {
			context.onPress();
		} else if (props.onThreadPress && item.tlm) {
			props.onThreadPress(item);
		}
	};

	const handleLongPress = () => {
		if (context?.onLongPress) {
			context.onLongPress();
		} else if (props.onLongPress) {
			props.onLongPress(item);
		}
	};

	// Skip special styling for system messages
	if (props.isInfo || (item.t && ['e2e', 'discussion-created', 'jitsi_call_started', 'videoconf'].includes(item.t))) {
		return (
			<View style={[styles.systemMessageContainer, { backgroundColor: themes[theme].messageboxBackground }]}>
				<Text style={{ color: themes[theme].bodyText }}>{item.msg}</Text>
			</View>
		);
	}

	// Determine if we should show the tail (first message or different sender from previous)
	const showTail = isMock || !previousItem || previousItem.u?.username !== item.u?.username;

	// Determine if we should show username (not own message and first message from this user)
	const showUsername = !isOwn && showTail && item.u?.username !== user.username;

	// Get username color
	const usernameColor = item.u?.username ? getUsernameColor(item.u.username) : '#000000';

	// Create a message context with all necessary values, including proper translateLanguage
	const messageContextValue = {
		user,
		onPress: handlePress,
		onLongPress: handleLongPress,
		onReactionPress: props.onReactionPress,
		onReactionLongPress: props.onReactionLongPress,
		reactionInit: props.reactionInit,
		translateLanguage: canTranslateMessage ? autoTranslateLanguage : undefined,
		rid: props.rid,
		baseUrl: props.baseUrl
	};

	return (
		<MessageContext.Provider value={messageContextValue}>
			<View
				style={[
					styles.container,
					{ flexDirection: 'row', justifyContent: isOwn ? 'flex-end' : 'flex-start', alignItems: 'flex-start' }
				]}>
				{/* Avatar on left for others, right for self */}
				{!isOwn && <Avatar text={item.u?.username} size={32} borderRadius={16} style={{ marginRight: 8 }} />}
				{/* Message bubble and reply/icons row stacked vertically */}
				<View style={{ flex: 1, flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
					<View style={isOwn ? styles.ownMessageWrapper : styles.otherMessageWrapper}>
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={handlePress}
							onLongPress={handleLongPress}
							style={isOwn ? styles.ownMessage : styles.otherMessage}>
							{/* Add tail if it's the first message from this user */}
							{showTail && <View style={isOwn ? styles.ownTail : styles.otherTail} />}
							<View style={styles.bubbleMessageContent}>
								{/* Show username for others if it's the first from this sender */}
								{showUsername && item.u?.username && (
									<Text
										style={
											isOwn
												? [styles.userName, styles.ownMessageText]
												: [styles.userName, styles.otherMessageText, { color: usernameColor as string }]
										}>
										{item.u.username}
									</Text>
								)}
								{/* Message content */}
								{item.msg ? (
									<Markdown
										msg={item.msg}
										theme={theme}
										username={user?.username}
										getCustomEmoji={getCustomEmoji}
										textColor={isOwn ? '#FFFFFF' : '#000000'}
									/>
								) : null}
								{/* Attachments - now context is provided above */}
								<Attachments
									attachments={item.attachments}
									timeFormat={props.timeFormat}
									showAttachment={showAttachment}
									getCustomEmoji={getCustomEmoji}
								/>
								{/* Timestamp */}
								{timestamp ? (
									<Text style={[styles.timestamp, isOwn ? { color: '#FFFFFF' } : { color: '#888888' }]}>{timestamp}</Text>
								) : null}
							</View>
						</TouchableOpacity>
						{/* Absolutely positioned reactions row inside bubble wrapper */}
						<View
							style={[
								styles.reactionsRowAbsoluteContainer,
								isOwn ? styles.ownReactionsContainer : styles.otherReactionsContainer
							]}>
							<CustomReactions reactions={item.reactions || []} getCustomEmoji={getCustomEmoji} isOwn={isOwn} />
						</View>
					</View>
					{/* Reply button and icons row below the reactions row */}
					<View style={[styles.replyRow, isOwn ? { marginLeft: 'auto', maxWidth: '75%', marginRight: 12 } : { marginLeft: 12 }]}>
						<TouchableOpacity
							style={styles.replyButton}
							onPress={() => {
								if (props.onThreadPress) {
									props.onThreadPress(item);
								}
							}}>
							<Text style={styles.replyButtonText}>Reply</Text>
						</TouchableOpacity>
						<View style={styles.iconCount}>
							<CustomIcon name='message' size={18} style={styles.icon} color='#1E2A3A' />
							<Text style={styles.iconText}>{item.tcount ?? 0}</Text>
						</View>
						<View style={styles.iconCount}>
							<CustomIcon name='user' size={18} style={styles.icon} color='#1E2A3A' />
							<Text style={styles.iconText}>{item.replies ? item.replies.length : 0}</Text>
						</View>
					</View>
				</View>
				{isOwn && <Avatar text={item.u?.username} size={32} borderRadius={16} style={{ marginLeft: 8 }} />}
			</View>
		</MessageContext.Provider>
	);
};

export default Room247Message;
