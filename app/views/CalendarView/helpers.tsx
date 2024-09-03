import { useState, useCallback } from 'react';

import log from '../../lib/methods/helpers/log';
import { Services as RocketChat } from '../../lib/services';

export const useLoadPeers = () => {
	const [state, setState] = useState({
		data: [],
		loading: false,
		refreshing: false,
		text: '',
		total: -1,
		numUsersFetched: 0,
		globalUsers: true,
		type: 'users'
	});

	const loadPeers = useCallback(
		async ({ newSearch = false }) => {
			if (newSearch) {
				setState(prevState => ({ ...prevState, data: [], total: -1, numUsersFetched: 0, loading: false }));
			}

			const { loading, total, numUsersFetched } = state;
			if (loading || (numUsersFetched >= total && total !== -1)) {
				return;
			}

			setState(prevState => ({ ...prevState, loading: true }));

			try {
				const { data, type, text, globalUsers } = state;
				const query = { text, type, workspace: globalUsers ? 'all' : 'local' };

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
						results.map(async item => {
							const user = await RocketChat.getUserInfo(item._id);
							if (user.user.roles.includes('Peer Supporter')) {
								combinedResults.push({ ...item, customFields: user.user.customFields });
							}
						})
					);

					setState(prevState => ({
						...prevState,
						data: [...prevState.data, ...combinedResults],
						loading: false,
						refreshing: false,
						numUsersFetched: prevState.numUsersFetched + directories.count,
						total: directories.total
					}));
				} else {
					setState(prevState => ({ ...prevState, loading: false, refreshing: false }));
				}
			} catch (e) {
				log(e);
				setState(prevState => ({ ...prevState, loading: false, refreshing: false }));
			}
		},
		[state]
	);

	const updateState = useCallback(newState => {
		setState(prevState => ({ ...prevState, ...newState }));
	}, []);

	return {
		...state,
		loadPeers,
		updateState
	};
};
