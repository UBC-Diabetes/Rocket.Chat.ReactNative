import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import MessageContainer from './index';
import { TAnyMessageModel, TGetCustomEmoji, IAttachment } from '../../definitions';
import { IRoomInfoParam } from '../../views/SearchMessagesView';

const styles = StyleSheet.create({
	container: {
		width: '100%', // Take full width
		paddingVertical: 4,
		flexDirection: 'row' // Use row to allow alignment
	},
	ownMessageWrapper: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end' // Align to the right
	},
	otherMessageWrapper: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start' // Align to the left
	},
	ownMessage: {
		maxWidth: '75%', // Limit width to 75% of container
		backgroundColor: '#dcf8c6', // Light green for own messages
		borderRadius: 12,
		borderTopRightRadius: 4, // Custom corner for WhatsApp style
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.05)',
		overflow: 'hidden',
		marginRight: 12,
		// Add shadow for depth
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 1,
		elevation: 1,
		position: 'relative' // For positioning the tail
	},
	otherMessage: {
		maxWidth: '75%', // Limit width to 75% of container
		backgroundColor: '#fff', // White for received messages
		borderRadius: 12,
		borderTopLeftRadius: 4, // Custom corner for WhatsApp style
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.05)',
		overflow: 'hidden',
		marginLeft: 12,
		// Add shadow for depth
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 1,
		elevation: 1,
		position: 'relative' // For positioning the tail
	},
	messageContent: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		paddingBottom: 16, // Extra padding at bottom for timestamp
		backgroundColor: 'transparent',
		minWidth: 80 // Add minimum width to ensure bubble is visible
	},
	timestamp: {
		fontSize: 10,
		color: 'rgba(0,0,0,0.5)',
		position: 'absolute',
		right: 8,
		bottom: 4
	},
	// Message tail styles
	ownTail: {
		position: 'absolute',
		right: -8,
		top: 0,
		width: 8,
		height: 16,
		backgroundColor: '#dcf8c6', // Same as bubble color
		borderTopRightRadius: 8
	},
	otherTail: {
		position: 'absolute',
		left: -8,
		top: 0,
		width: 8,
		height: 16,
		backgroundColor: '#fff', // Same as bubble color
		borderTopLeftRadius: 8
	},
	// Add extra styling for user name in group chats
	userName: {
		fontSize: 12,
		fontWeight: 'bold',
		marginBottom: 2,
		color: '#4287f5' // Blue color for user names
	}
});

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
	// Other props from MessageContainer
	[key: string]: any;
}

const Room247Message = (props: IRoom247MessageProps) => {
	const { item, user, previousItem } = props;

	// Check if the message is from the current user
	const isOwn = item?.u?.username === user?.username;

	// Format timestamp to be used for time display
	const timestamp = item.ts ? new Date(item.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

	// Skip special styling for system messages
	if (props.isInfo || (item.t && ['e2e', 'discussion-created', 'jitsi_call_started', 'videoconf'].includes(item.t))) {
		return <MessageContainer {...props} />;
	}

	// Determine if we should show the tail (first message or different sender from previous)
	const showTail = !previousItem || previousItem.u?.username !== item.u?.username;

	// Determine if we should show username (not own message and first message from this user)
	const showUsername = !isOwn && showTail && item.u?.username !== user.username;

	return (
		<View style={styles.container}>
			<View style={isOwn ? styles.ownMessageWrapper : styles.otherMessageWrapper}>
				<View style={isOwn ? styles.ownMessage : styles.otherMessage}>
					{/* Add tail if it's the first message from this user */}
					{showTail && (
						<View style={isOwn ? styles.ownTail : styles.otherTail} />
					)}

					<View style={styles.messageContent}>
						{/* Show username for messages from others if it's the first from this sender */}
						{showUsername && item.u?.username && (
							<Text style={styles.userName}>{item.u.username}</Text>
						)}

						<MessageContainer 
							{...props} 
							style={{ backgroundColor: 'transparent' }}
						/>
						
						{timestamp ? (
							<Text style={styles.timestamp}>{timestamp}</Text>
						) : null}
					</View>
				</View>
			</View>
		</View>
	);
};

export default Room247Message;
