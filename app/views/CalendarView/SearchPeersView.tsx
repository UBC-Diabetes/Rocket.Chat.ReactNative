import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import StatusBar from '../../containers/StatusBar';
import { useTheme } from '../../theme';
import { debounce } from '../../lib/methods/helpers/debounce';
import { Services as RocketChat } from '../../lib/services';
import log from '../../lib/methods/helpers/log';

export interface IUser {
	user: {
		id: string;
		token: string;
	};
}

const SearchPeersView = () => {
	const theme = useTheme();
	const { colors } = theme;

	const [state, setState] = useState({
		data: [],
		loading: false,
		refreshing: false,
		text: '',
		total: -1,
		numUsersFetched: 0,
		showOptionsDropdown: false,
		globalUsers: true,
		type: 'users'
	});

	const navigation = useNavigation<StackNavigationProp<any>>();
	useEffect(() => {
		navigation.setOptions({ title: '', headerStyle: { shadowColor: 'transparent' } });
		loadPeers({});
	});

	const loadPeers = debounce(async ({ newSearch = false }) => {
		if (newSearch) {
			setState({ data: [], total: -1, numUsersFetched: 0, loading: false });
		}
		const { loading, total, numUsersFetched } = state;
		if (loading || (numUsersFetched >= total && total !== -1)) {
			return;
		}

		setState({ ...state, loading: true });

		try {
			const { data, type, text, globalUsers, numUsersFetched } = state;
			const query = { text, type, workspace: globalUsers ? 'all' : 'local' };

			//Returns 50 users based on offset, sorted by name from the directory of ALL users
			const directories = await RocketChat.getDirectory({
				query,
				offset: numUsersFetched,
				count: 50,
				sort: { name: 1 }
			});
			if (directories.success) {
				const combinedResults = [];
				const results = directories.result;

				await Promise.all(
					results.map(async (item, index) => {
						const user = await RocketChat.getUserInfo(item._id);
						//Only keep users that are Peer Supporters
						if (user.user.roles.includes('Peer Supporter')) {
							combinedResults.push({ ...item, customFields: user.user.customFields });
						}
					})
				);

				console.log('hey', combinedResults);

				// Update total number of users in directory, and number fetched (including filtered out users)
				setState({
					data: [...data, ...combinedResults],
					loading: false,
					refreshing: false,
					numUsersFetched: numUsersFetched + directories.count,
					total: directories.total
				});
			} else {
				setState({ ...state, loading: false, refreshing: false });
			}
		} catch (e) {
			log(e);
			setState({ ...state, loading: false, refreshing: false });
		}
	}, 200);

	return (
		<View style={{ flex: 1, backgroundColor: colors.backgroundColor }} testID='calendar-view'>
			<StatusBar />
			{state.data.map(d => (
				<Text>{d.username}</Text>
			))}
		</View>
	);
};

export default SearchPeersView;
