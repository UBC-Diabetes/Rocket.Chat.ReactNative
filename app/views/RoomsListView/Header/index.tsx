import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { setSearch } from '../../../actions/rooms';
import Header from './Header';
import { IApplicationState } from '../../../definitions';

interface IRoomsListHeaderViewProps {
	showSearchHeader: boolean;
	serverName: string;
	connecting: boolean;
	connected: boolean;
	isFetching: boolean;
	server: string;
	dispatch: Dispatch;
	width?: number;
}

class RoomsListHeaderView extends PureComponent<IRoomsListHeaderViewProps, any> {
	onSearchChangeText = (text: string) => {
		const { dispatch } = this.props;
		dispatch(setSearch(text.trim()));
	};

	render() {
		const { serverName, showSearchHeader } = this.props;

		return <Header serverName={serverName} showSearchHeader={showSearchHeader} onSearchChangeText={this.onSearchChangeText} />;
	}
}

const mapStateToProps = (state: IApplicationState) => ({
	showSearchHeader: state.rooms.showSearchHeader,
	connecting: state.meteor.connecting || state.server.loading,
	connected: state.meteor.connected,
	isFetching: state.rooms.isFetching,
	serverName: state.settings.Site_Name as string,
	server: state.server.server
});

export default connect(mapStateToProps)(RoomsListHeaderView);
