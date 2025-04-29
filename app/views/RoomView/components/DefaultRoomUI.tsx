import React, { RefObject } from 'react';
import { withTheme } from '../../../theme';
import { themes } from '../../../lib/constants';
import StatusBar from '../../../containers/StatusBar';
import SafeAreaView from '../../../containers/SafeAreaView';
import Banner from '../Banner';
import UploadProgress from '../UploadProgress';
import JoinCode, { IJoinCode } from '../JoinCode';
import I18n from '../../../i18n';
import List from '../List';
import { IUser, TSubscriptionModel } from '../../../definitions';

interface IDefaultRoomUIProps {
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

const DefaultRoomUI = ({
	theme,
	rid,
	t,
	tmid,
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
	onJoin,
	serverVersion,
	listRef,
	flatList,
	renderRow,
	hideSystemMessages,
	showMessageInMainThread
}: IDefaultRoomUIProps) => {
	return (
		<SafeAreaView style={{ backgroundColor: themes[theme].backgroundColor }} testID='room-view'>
			<StatusBar />
			<Banner title={I18n.t('Announcement')} text={announcement} bannerClosed={bannerClosed} closeBanner={closeBanner} />
			<List
				ref={listRef}
				listRef={flatList}
				rid={rid}
				tmid={tmid}
				renderRow={renderRow}
				loading={loading}
				hideSystemMessages={hideSystemMessages}
				showMessageInMainThread={showMessageInMainThread}
				serverVersion={serverVersion}
			/>
			{renderFooter()}
			{renderActions()}
			<UploadProgress rid={rid} user={user} baseUrl={baseUrl} width={width} />
			<JoinCode ref={joinCode} onJoin={onJoin} rid={rid} t={t} theme={theme} />
		</SafeAreaView>
	);
};

export default withTheme(DefaultRoomUI);
