import { useState, useCallback, useRef } from 'react';

import { Services as RocketChat } from '../../lib/services';
import { useDebounce } from '../../lib/methods/helpers/debounce';

export const useLoadPeers = () => {
	const [state, setState] = useState({
		data: [],
		loading: false,
		text: '',
		total: -1,
		numUsersFetched: 0,
		globalUsers: true,
		type: 'users'
	});

	const loadPeersImpl = async ({ newSearch = false }) => {
		if (newSearch) {
			setState(prevState => ({ ...prevState, data: [], total: -1, numUsersFetched: 0 }));
		}

		const { loading, total, numUsersFetched, text, type, globalUsers } = state;
		if (loading || (numUsersFetched >= total && total !== -1)) {
			return;
		}

		setState(prevState => ({ ...prevState, loading: true }));

		try {
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
					numUsersFetched: prevState.numUsersFetched + directories.count,
					total: directories.total
				}));
			} else {
				setState(prevState => ({ ...prevState, loading: false }));
			}
		} catch (e) {
			console.error(e);
			setState(prevState => ({ ...prevState, loading: false }));
		}
	};

	const debouncedLoadPeers = useDebounce(loadPeersImpl, 300);

	const loadPeers = useCallback(
		({ newSearch = false }) => {
			debouncedLoadPeers({ newSearch });
		},
		[debouncedLoadPeers]
	);

	const updateSearchText = useCallback(
		(text: string) => {
			setState(prevState => ({ ...prevState, text }));
			loadPeers({ newSearch: true });
		},
		[loadPeers]
	);

	return {
		...state,
		loadPeers,
		updateSearchText
	};
};
