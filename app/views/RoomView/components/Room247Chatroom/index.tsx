import React, { RefObject } from 'react';

import { themes } from '../../../../lib/constants';
import SafeAreaView from '../../../../containers/SafeAreaView';
import UploadProgress from '../../UploadProgress';
import JoinCode, { IJoinCode } from '../../JoinCode';
import I18n from '../../../../i18n';
import Room247List from './List';
import { IUser, TSubscriptionModel } from '../../../../definitions';
import { useMessages } from '../../List/hooks';
import { TSupportedThemes, withTheme } from '../../../../theme';
import { WhatsAppBackground } from '../../../../containers/message/WhatsAppStyle';

interface IRoom247ChatroomProps {
	theme: string;
	rid: string;
	t?: string;
	tmid?: string;
	room: TSubscriptionModel;
	user: IUser;
	baseUrl: string;
	width: number;
	loading: boolean;
	announcement?: string;
	bannerClosed?: boolean;
	closeBanner: () => void;
	renderFooter: () => React.ReactElement | null;
	renderActions: () => React.ReactElement | null;
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
	t,
	tmid,
	user,
	baseUrl,
	width,
	loading,
	joinCode,
	onJoin,
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
		/>
	);
};

export default withTheme(Room247Chatroom);
