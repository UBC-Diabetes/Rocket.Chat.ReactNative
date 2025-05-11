import React, { RefObject } from 'react';

import { IJoinCode } from '../../JoinCode';
import Room247List from './List';
import Room247Message from './Room247Message';
import MessageAvatar from './MessageAvatar';
import User from './User';
import Content from './Content';
import { IUser } from '../../../../definitions';
import { useMessages } from '../../List/hooks';
import { TSupportedThemes, withTheme } from '../../../../theme';

interface IRoom247ChatroomProps {
	theme: string;
	rid: string;
	t?: string;
	tmid?: string;
	user: IUser;
	baseUrl: string;
	width: number;
	loading: boolean;
	joinCode: RefObject<IJoinCode>;
	onJoin: () => void;
	serverVersion: string | null;
	listRef: any;
	flatList: any;
	renderRow: any;
	hideSystemMessages: string[];
	showMessageInMainThread: boolean;
}

const Room247Chatroom = ({
	theme,
	rid,
	tmid,
	user,
	baseUrl,
	width,
	loading,
	serverVersion,
	listRef,
	flatList,
	renderRow,
	hideSystemMessages,
	showMessageInMainThread
}: IRoom247ChatroomProps) => {
	const [messages, messagesIds, fetchMessages] = useMessages({
		rid,
		tmid,
		showMessageInMainThread,
		serverVersion,
		hideSystemMessages
	});

	// Convert theme string to TSupportedThemes
	const supportedTheme =
		theme === 'light' || theme === 'dark' || theme === 'black' ? (theme as TSupportedThemes) : ('light' as TSupportedThemes);

	return (
		<Room247List
			theme={supportedTheme}
			messages={messages}
			renderItem={(item, prevItem) => renderRow(item, prevItem, null)}
			loading={loading}
			fetchMessages={fetchMessages}
		/>
	);
};

export { Room247Message, MessageAvatar, User, Content };
export default withTheme(Room247Chatroom);
