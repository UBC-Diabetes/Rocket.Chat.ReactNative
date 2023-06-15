import React from 'react';
import { Text, View } from 'react-native';

import { withTheme } from '../../../../theme';

const DiscussionCard: React.FC = () => (
	<View style={{ width: '100%', flexDirection: 'row' }}>
		<View
			style={{
				borderRadius: 10,
				backgroundColor: '#FDCA7D',
				height: 80,
				width: 80,
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<Text>Image</Text>
		</View>
		<View style={{ flex: 1, paddingTop: 6, marginLeft: 12, marginRight: 15 }}>
			<Text
				style={{
					fontFamily: 'Inter',
					fontWeight: '500',
					fontSize: 16,
					lineHeight: 19
				}}
			>
				Post title
			</Text>
			<Text
				style={{
					fontFamily: 'Inter',
					fontWeight: '400',
					fontSize: 12,
					lineHeight: 15,
					marginTop: 4
				}}
			>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et elit dignissim, lobortis neque vel, tincidunt lectus.
				Nulla facilisi.
			</Text>
		</View>

		<View
			style={{
				backgroundColor: 'lightgreen',
				width: 42,
				height: 42,
				marginTop: 10,
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<Text>Save</Text>
		</View>
	</View>
);

export default withTheme(DiscussionCard);
