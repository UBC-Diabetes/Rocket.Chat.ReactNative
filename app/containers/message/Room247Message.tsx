import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MessageContainer from './index';
import { themes } from '../../lib/constants';
import { TAnyMessageModel, TGetCustomEmoji, IAttachment } from '../../definitions';
import { IRoomInfoParam } from '../../views/SearchMessagesView';
import { TSupportedThemes } from '../../theme';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginVertical: 2
	},
	ownMessage: {
		alignSelf: 'flex-end',
		backgroundColor: '#dcf8c6', // Light green for own messages
		marginLeft: 60,
		marginRight: 10,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.1)',
		overflow: 'hidden'
	},
	otherMessage: {
		alignSelf: 'flex-start',
		backgroundColor: '#fff', // White for received messages
		marginRight: 60,
		marginLeft: 10,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.1)',
		overflow: 'hidden'
	},
	childContainer: {
		backgroundColor: 'transparent',
		paddingHorizontal: 8,
		paddingVertical: 4
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
	const { item, user } = props;

	// Check if the message is from the current user
	const isOwn = item?.u?.username === user?.username;

	// Skip special styling for system messages
	if (props.isInfo || (item.t && ['e2e', 'discussion-created', 'jitsi_call_started', 'videoconf'].includes(item.t))) {
		return <MessageContainer {...props} />;
	}

	return (
		<View style={[styles.container, isOwn ? styles.ownMessage : styles.otherMessage]}>
			<View style={styles.childContainer}>
				<MessageContainer {...props} style={styles.childContainer} />
			</View>
		</View>
	);
};

export default Room247Message;
