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

	const isSearchActive = useRef(false);

	const loadPeersImpl = async ({ newSearch = false, searchText = state.text }) => {
		if (newSearch) {
			setState(prevState => ({ ...prevState, data: [], total: -1, numUsersFetched: 0 }));
			isSearchActive.current = searchText !== '';
		}

		if (isSearchActive.current && !newSearch) {
			// Don't load more results if a search is active
			return;
		}

		setState(prevState => ({ ...prevState, loading: true }));

		try {
			const query = { text: searchText, type: state.type, workspace: state.globalUsers ? 'all' : 'local' };

			const directories = await RocketChat.getDirectory({
				query,
				offset: newSearch ? 0 : state.numUsersFetched,
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
					data: newSearch ? combinedResults : [...prevState.data, ...combinedResults],
					loading: false,
					numUsersFetched: newSearch ? combinedResults.length : prevState.numUsersFetched + combinedResults.length,
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
			debouncedLoadPeers({ newSearch, searchText: state.text });
		},
		[state.text]
	);

	const updateSearchText = useCallback((text: string) => {
		setState(prevState => ({ ...prevState, text }));
		debouncedLoadPeers({ newSearch: true, searchText: text });
	}, []);

	return {
		...state,
		loadPeers,
		updateSearchText
	};
};
