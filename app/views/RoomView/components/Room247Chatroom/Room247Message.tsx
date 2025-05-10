import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { useTheme } from '../../../../theme';
import MessageContext from '../../../../containers/message/Context';
import { TAnyMessageModel, TGetCustomEmoji, IAttachment } from '../../../../definitions';
import { IRoomInfoParam } from '../../../SearchMessagesView';
import Markdown from '../../../../containers/markdown';
import Attachments from '../../../../containers/message/Components/Attachments';
import styles from './styles';
import { themes } from '../../../../lib/constants';

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

const Room247Message = (props: IRoom247MessageProps) => {
	const { item, user, previousItem, getCustomEmoji, showAttachment, autoTranslateRoom, autoTranslateLanguage } = props;
	const context = useContext(MessageContext);
	const { theme } = useTheme();

	// Check if the message is from the current user
	const isOwn = item?.u?.username === user?.username;
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
	const showTail = !previousItem || previousItem.u?.username !== item.u?.username;

	// Determine if we should show username (not own message and first message from this user)
	const showUsername = !isOwn && showTail && item.u?.username !== user.username;

	// Create a message context with all necessary values, including proper translateLanguage
	const messageContextValue = {
		user,
		onPress: handlePress,
		onLongPress: handleLongPress,
		translateLanguage: canTranslateMessage ? autoTranslateLanguage : undefined,
		rid: props.rid,
		baseUrl: props.baseUrl
	};

	return (
		<View style={styles.container}>
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
						{showUsername && item.u?.username && <Text style={styles.userName}>{item.u.username}</Text>}

						{/* Message content */}
						{item.msg ? (
							<Markdown msg={item.msg} theme={theme} username={user?.username} getCustomEmoji={getCustomEmoji} />
						) : null}

						{/* Attachments - wrap in MessageContext.Provider with proper translation support */}
						<MessageContext.Provider value={messageContextValue}>
							<Attachments
								attachments={item.attachments}
								timeFormat={props.timeFormat}
								showAttachment={showAttachment}
								getCustomEmoji={getCustomEmoji}
							/>
						</MessageContext.Provider>

						{/* Timestamp */}
						{timestamp ? <Text style={styles.timestamp}>{timestamp}</Text> : null}
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default Room247Message;
