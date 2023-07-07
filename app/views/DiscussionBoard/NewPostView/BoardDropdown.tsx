import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';

import PopUpModal from '../Components/PopUpModal';
import { BoardDropdownModalProps } from './interfaces';
import { getIcon, getColor } from '../helpers';
import { withTheme } from '../../../theme';

const screenHeight = Dimensions.get('window').height;

const BoardDropdownModal: React.FC<BoardDropdownModalProps> = ({ show, close, data, onSelect }) => (
	<PopUpModal show={show} close={close}>
		<ScrollView style={styles.mainContainer}>
			{data?.map((item, index) => (
				<TouchableOpacity style={styles.boardContainer} key={index} onPress={() => onSelect(item)}>
					<View style={{ ...styles.iconContainer, backgroundColor: getColor(item.color) }}>
						<Image source={getIcon(item.icon)} style={styles.icon} resizeMode='contain' />
					</View>
					<Text>{item.title}</Text>
				</TouchableOpacity>
			))}
			<View style={styles.spacer} />
		</ScrollView>
	</PopUpModal>
);

export default withTheme(BoardDropdownModal);

const styles = StyleSheet.create({
	mainContainer: {
		width: '100%',
		maxHeight: screenHeight * 0.6,
		padding: 20
	},
	boardContainer: {
		backgroundColor: '#fff',
		padding: 10,
		marginBottom: 2,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 25,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.05,
		shadowRadius: 10
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10
	},
	icon: {
		height: 20,
		width: 20
	},
	spacer: {
		height: 20
	}
});
