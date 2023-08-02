import { Q } from '@nozbe/watermelondb';
import { Subscription } from 'rxjs';

import database from '../../lib/database';
import { TSubscriptionModel } from '../../definitions';

const CHAT247ROOMID = '24-7-chatroom';
const QUERY_SIZE = 20;

let querySubscription: Subscription;
let count = 0;

const unsubscribeQuery = () => {
	if (querySubscription && querySubscription.unsubscribe) {
		querySubscription.unsubscribe();
	}
};

export const get247Chat = async (): Promise<TSubscriptionModel | undefined> => {
	let chatRoom: TSubscriptionModel | undefined;

	unsubscribeQuery();

	const db = database.active;

	const defaultWhereClause = [Q.where('archived', false), Q.where('open', true)] as (Q.WhereDescription | Q.SortBy)[];
	defaultWhereClause.push(Q.experimentalSortBy('room_updated_at', Q.desc));

	count += QUERY_SIZE;
	const observable = await db
		.get('subscriptions')
		.query(...defaultWhereClause, Q.experimentalSkip(0), Q.experimentalTake(count))
		.observeWithColumns(['on_hold']);

	const subscriptionPromise = new Promise<void>((resolve, reject) => {
		querySubscription = observable.subscribe(
			data => {
				chatRoom = data.find(chat => chat.name === CHAT247ROOMID);
				resolve();
			},
			error => {
				reject(error);
			}
		);
	});

	await subscriptionPromise;
	return chatRoom;
};
