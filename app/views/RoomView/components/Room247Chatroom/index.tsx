import React, { RefObject } from 'react';
import { View, Text } from 'react-native';
import { withTheme } from '../../../../theme';
import styles from './styles';
import { themes } from '../../../../lib/constants';
import StatusBar from '../../../../containers/StatusBar';
import SafeAreaView from '../../../../containers/SafeAreaView';
import Banner from '../../Banner';
import UploadProgress from '../../UploadProgress';
import JoinCode, { IJoinCode } from '../../JoinCode';
import I18n from '../../../../i18n';
import { IUser, TSubscriptionModel } from '../../../../definitions';

interface IRoom247ChatroomProps {
	theme: string;
	rid: string;
	tmid?: string;
	room: TSubscriptionModel;
	user: IUser;
	baseUrl: string;
	width: number;
	loading: boolean;
	announcement?: string;
	bannerClosed?: boolean;
	closeBanner: () => void;
	onSendMessage: (message: string, tshow?: boolean) => void;
	renderItem: (item: any, prevItem: any, highlightedMessage?: string) => React.ReactElement;
	renderFooter: () => React.ReactElement;
	renderActions: () => React.ReactElement;
	joinCode: RefObject<IJoinCode>;
	onJoin: () => void;
	t?: string;
}

const Room247Chatroom = ({
	theme,
	rid,
	t,
	announcement,
	bannerClosed,
	closeBanner,
	user,
	baseUrl,
	width,
	loading,
	renderFooter,
	renderActions,
	joinCode,
	onJoin
}: IRoom247ChatroomProps) => {
	return (
		<SafeAreaView style={{ backgroundColor: themes[theme].backgroundColor }} testID='room-view-247-chatroom'>
			<StatusBar />
			<Banner title={I18n.t('Announcement')} text={announcement} bannerClosed={bannerClosed} closeBanner={closeBanner} />

			{/* Temporarily render a placeholder message until we implement the full WhatsApp-like UI */}
			<View style={styles.container}>
				<Text style={[styles.text, { color: themes[theme].titleText }]}>{I18n.t('24/7 Chatroom')}</Text>
				<Text style={[styles.subtitle, { color: themes[theme].auxiliaryText }]}>{I18n.t('24/7 Chatroom')}</Text>
			</View>

			{/* We still render these components to ensure functionality works */}
			{renderFooter()}
			{renderActions()}
			<UploadProgress rid={rid} user={user} baseUrl={baseUrl} width={width} />
			<JoinCode ref={joinCode} onJoin={onJoin} rid={rid} t={t} theme={theme} />
		</SafeAreaView>
	);
};

export default withTheme(Room247Chatroom);
