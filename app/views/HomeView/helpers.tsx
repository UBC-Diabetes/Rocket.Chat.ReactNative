import { Q } from '@nozbe/watermelondb';

import database from '../../lib/database';
import { SubscriptionType } from '../../definitions';
import { goRoom } from '../../lib/methods/helpers/goRoom';
import { Services } from '../../lib/services';
import log from '../../lib/methods/helpers/log';

const CHAT247ROOMID = '24-7-chatroom';
const VIRTUAL_HAPPY_HOUR_ROOMID = 'virtual-happy-hours';
const TECH_SUPPORT_USERNAME = 'tech_support';

export const navToTechSupport = async (Navigation: any): Promise<void> => {
	let query;
	try {
		const db = database.active;
		const subsCollection = db.get('subscriptions');
		query = await subsCollection.query(Q.where('name', TECH_SUPPORT_USERNAME)).fetch();
		if (query.length > 0) {
			const room = query[0];
			await Navigation.navigate('RoomView');
			goRoom({ item: room, isMasterDetail: true });
		} else {
			const result = await Services.createDirectMessage(TECH_SUPPORT_USERNAME);
			if (result.success) {
				const item = { tmid: result.room?._id, name: TECH_SUPPORT_USERNAME, t: SubscriptionType.DIRECT };
				await Navigation.navigate('RoomView');
				goRoom({ item, isMasterDetail: true });
			}
		}
	} catch (e) {
		log(e);
	}
};

export const navigateToVirtualHappyHour = async (Navigation: any) => {
	if (Navigation) {
		try {
			const db = database.active;
			const subsCollection = db.get('subscriptions');
			const query = await subsCollection.query(Q.where('name', VIRTUAL_HAPPY_HOUR_ROOMID)).fetch();

			if (query.length > 0) {
				const chatRoom = query[0];
				await Navigation.navigate('RoomView');
				goRoom({ item: chatRoom, isMasterDetail: true });
			}
		} catch (error) {
			console.error('error', error);
		}
	}
};

export const navigateTo247Chat = async (Navigation: any) => {
	if (Navigation) {
		try {
			console.log('CHAT247ROOMID:', CHAT247ROOMID);

			console.log('Starting 247 navigation');
			const db = database.active;
			const subsCollection = db.get('subscriptions');

			const allSubs = await subsCollection.query().fetch();
			console.log(
				'All subscription names:',
				allSubs.map(s => s.name)
			);

			const query = await subsCollection.query(Q.where('name', CHAT247ROOMID)).fetch();
			console.log('247 query result:', query.length > 0 ? 'found' : 'not found');

			if (query.length > 0) {
				console.log('About to navigate to 247');

				const chatRoom = query[0];
				await Navigation.navigate('RoomView');
				console.log('About to goRoom 247');

				goRoom({ item: chatRoom, isMasterDetail: true });
				console.log('247 navigation complete');
			}
		} catch (error) {
			console.error('error', error);
		}
	}
};
