import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		marginTop: 12,
		marginBottom: 12
	},
	bubble: {
		backgroundColor: '#fff',
		borderRadius: 20,
		paddingHorizontal: 18,
		paddingVertical: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.08,
		shadowRadius: 2,
		elevation: 1,
		alignSelf: 'center'
	},
	text: {
		fontSize: 14,
		color: '#8c8c8c',
		fontWeight: '400'
	}
});

const getDateLabel = (ts?: Date | string | null) => {
	if (!ts) return '';
	const m = moment(ts);
	if (m.isSame(moment(), 'day')) return 'Today';
	if (m.isSame(moment().subtract(1, 'day'), 'day')) return 'Yesterday';
	return m.format('LL');
};

const Room247MessageSeparator = ({ ts }: { ts?: Date | string | null }) => {
	if (!ts) return null;
	const label = getDateLabel(ts);
	return (
		<View style={styles.container}>
			<View style={styles.bubble}>
				<Text style={styles.text}>{label}</Text>
			</View>
		</View>
	);
};

export default Room247MessageSeparator;
