import React, { useContext } from 'react';
import { Text, View } from 'react-native';

import styles from './styles';
import { themes } from '../../lib/constants';
import MessageContext from './Context';
import ThreadDetails from '../ThreadDetails';
import I18n from '../../i18n';
import { IMessageThread } from './interfaces';
import { useTheme } from '../../theme';

const Thread = React.memo(
	({ msg, tcount, tlm, isThreadRoom, id, isRoom247Chatroom }: IMessageThread) => {
		const { theme } = useTheme();
		const { threadBadgeColor, toggleFollowThread, user, replies } = useContext(MessageContext);

		// Commenting this out results in the blue Reply button always being visible
		// Otherwise, it is visible only if someone has replied as a thread already
		// We want it to be visible so people make more threads, organizing the discussion

		const isNotMain247Chatroom = isRoom247Chatroom && isThreadRoom;

		if (isNotMain247Chatroom && (!tlm || isThreadRoom || tcount === null)) {
			return null;
		}

		return (
			<View style={styles.buttonContainer}>
				<View
					style={[styles.button, { backgroundColor: themes[theme].badgeBackgroundLevel2 }]}
					testID={`message-thread-button-${msg}`}
				>
					<Text style={[styles.buttonText, { color: themes[theme].fontWhite }]}>{I18n.t('Reply')}</Text>
				</View>
				<ThreadDetails
					item={{
						tcount,
						replies,
						id
					}}
					user={user}
					badgeColor={threadBadgeColor}
					toggleFollowThread={toggleFollowThread}
					style={styles.threadDetails}
				/>
			</View>
		);
	},
	(prevProps, nextProps) => {
		if (prevProps.tcount !== nextProps.tcount) {
			return false;
		}
		return true;
	}
);

Thread.displayName = 'MessageThread';

export default Thread;
