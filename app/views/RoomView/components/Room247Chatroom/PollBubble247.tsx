import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Popover from 'react-native-popover-view';
import Touchable from 'react-native-platform-touchable';

import { CustomIcon } from '../../../../containers/CustomIcon';
import { usePermissions } from '../../../../lib/hooks/usePermissions';
import { themes } from '../../../../lib/constants';
import { useTheme } from '../../../../theme';
import { BUTTON_HIT_SLOP } from '../../../../containers/message/utils';

interface IPollBubble247Props {
	blocks: any[];
	creator: any;
	timestamp: any;
	rid?: string;
	user?: any;
	messageId?: string;
	blockAction?: (params: {
		actionId: string;
		appId: string;
		value: any;
		blockId: string;
		rid: string;
		mid: string;
	}) => void;
}

const PollBubble247 = ({ blocks, creator, timestamp, rid, user, messageId, blockAction }: IPollBubble247Props) => {
	const { theme } = useTheme();
	const [showOverflowMenu, setShowOverflowMenu] = useState(false);


	// Admin permission checking - check multiple levels as recommended by O3-mini
	// The usePermissions hook automatically merges global user roles + room-specific subscription roles
	const [canEditRoom] = usePermissions(['edit-room'], rid);
	const [canDeleteMessage] = usePermissions(['delete-message'], rid);
	const [canViewAdmin] = usePermissions(['view-room-administration'], rid);

	// Admin detection: if user can edit room, delete messages, or view admin panel
	const canFinishPoll = canEditRoom || canDeleteMessage || canViewAdmin;

	const overflowButtonRef = React.useRef<TouchableOpacity>(null);
	// Find poll title (first section block without a button accessory)
	const titleBlock = blocks.find((b: any) => b.type === 'section' && b.text?.text && !b.accessory?.type);
	const title = titleBlock?.text?.text || 'Poll';

	// Find all option blocks (section with button accessory)
	const optionBlocks = blocks.filter((b: any) => b.type === 'section' && b.accessory?.type === 'button');
	// Find all context blocks (results and voters)
	const contextBlocks = blocks.filter((b: any) => b.type === 'context');

	// For each option, find the next context block with a percentage after the option block
	function findResultForOption(optionIdx: number) {
		// Find the index of this option block in the original blocks array
		const optionBlock = optionBlocks[optionIdx];
		const optionBlockIdx = blocks.indexOf(optionBlock);
		// Look forward for the next context block with a percentage
		for (let i = optionBlockIdx + 1; i < blocks.length; i++) {
			const b = blocks[i];
			if (b.type === 'context' && b.elements?.[0]?.text) {
				const text = b.elements[0].text;
				// If it's a summary block, skip
				if (/votes? -/i.test(text)) continue;
				// If it matches a percentage, return the percentage
				const match = text.match(/([0-9.]+% \([0-9]+\))/);
				if (match) return match[1];
			}
			// Stop if we hit another section (next option)
			if (b.type === 'section' && b.accessory?.type === 'button' && b !== optionBlock) break;
		}
		return '';
	}

	const options = optionBlocks.map((option: any, i: number) => {
		return {
			text: option.text.text,
			button: option.accessory,
			result: findResultForOption(i)
		};
	});

	// Find the summary voters blocks (context blocks with 'votes -')
	const votersSummaryBlocks = contextBlocks
		.map((block: any) => block.elements?.[0]?.text)
		.filter((text: string | undefined) => text && /votes? -/i.test(text));

	// Parse and aggregate
	let totalVotes = 0;
	let allNames: string[] = [];
	votersSummaryBlocks.forEach((text: string) => {
		// Example: "2 votes - Alice Bob"
		const match = text.match(/^([0-9]+) votes? - (.+)$/i);
		if (match) {
			totalVotes += parseInt(match[1], 10);
			// Split names by space, comma, or both (adjust as needed)
			allNames.push(...match[2].split(/[, ]+/).filter(Boolean));
		}
	});
	// Remove duplicates and empty strings
	allNames = Array.from(new Set(allNames)).filter(Boolean);

	let votersSummary = '';
	if (totalVotes > 0 && allNames.length > 0) {
		votersSummary = `${totalVotes} votes - ${allNames.join(', ')}`;
	} else {
		votersSummary = `${totalVotes} votes`;
	}

	const handleOverflowPress = () => {
		setShowOverflowMenu(!showOverflowMenu);
	};

	// Finish poll handler using existing server action
	const handleFinishPoll = () => {
		setShowOverflowMenu(false);
		
		// Find the overflow block with finish action
		const finishBlock = blocks.find(b => 
			b.type === 'section' && 
			b.accessory?.type === 'overflow' && 
			b.accessory?.actionId === 'finish'
		);
		
		if (!finishBlock || !blockAction) {
			console.warn('Cannot finish poll: missing finish block or blockAction');
			return;
		}
		
		// Use the existing server action
		blockAction({
			actionId: 'finish',
			appId: finishBlock.appId,
			value: 'finish',
			blockId: finishBlock.blockId,
			rid: rid || '',
			mid: messageId || ''
		});
		
		console.log('Finish poll action triggered', {
			actionId: 'finish',
			appId: finishBlock.appId,
			blockId: finishBlock.blockId
		});
	};

	// Overflow menu options
	const menuOptions = [
		{
			title: 'Finish Poll',
			onPress: handleFinishPoll,
			icon: 'check',
			testID: 'poll-finish-option'
		}
	];

	return (
		<>
			<View style={styles.bubble}>
				<View style={styles.header}>
					<View style={styles.headerLeft}>
						<Text style={styles.creator}>{creator?.username || 'Poll Creator'}</Text>
						<Text style={styles.title}>{title}</Text>
					</View>
					{canFinishPoll && (
						<TouchableOpacity
							ref={overflowButtonRef}
							onPress={handleOverflowPress}
							hitSlop={BUTTON_HIT_SLOP}
							style={styles.overflowButton}
							testID='poll-overflow-menu'>
							<CustomIcon size={18} name='kebab' color={themes[theme].fontDefault} />
						</TouchableOpacity>
					)}
				</View>
				{options.map((opt: any, idx: number) => (
					<View key={idx} style={styles.optionRow}>
						<TouchableOpacity style={styles.optionButton}>
							<Text style={styles.optionText}>{opt.text}</Text>
						</TouchableOpacity>
						{opt.result && <Text style={styles.result}>{opt.result}</Text>}
					</View>
				))}
				{votersSummary ? <Text style={styles.voters}>{votersSummary}</Text> : null}
				<Text style={styles.timestamp}>
					{timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
				</Text>
			</View>
			{/* Render Popover separately, as per UIKit/Overflow pattern */}
			{canFinishPoll && (
				<Popover
					isVisible={showOverflowMenu}
					// fromView exists in Popover Component
					/* @ts-ignore*/
					fromView={overflowButtonRef.current}
					onRequestClose={() => setShowOverflowMenu(false)}>
					<View style={styles.menuContainer}>
						{menuOptions.map((option, index) => (
							<Touchable
								key={index}
								onPress={option.onPress}
								background={Touchable.Ripple(themes[theme].surfaceNeutral)}
								style={styles.menuOption}
								testID={option.testID}>
								<>
									<CustomIcon name={option.icon} size={16} color={themes[theme].fontDefault} style={styles.menuIcon} />
									<Text style={[styles.menuText, { color: themes[theme].fontDefault }]}>{option.title}</Text>
								</>
							</Touchable>
						))}
					</View>
				</Popover>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	bubble: {
		backgroundColor: 'white',
		borderRadius: 16,
		padding: 12,
		marginVertical: 4,
		minWidth: 200,
		maxWidth: '90%',
		alignSelf: 'flex-start'
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 8
	},
	headerLeft: {
		flex: 1
	},
	adminMenuContainer: {
		position: 'relative'
	},
	creator: {
		fontWeight: 'bold',
		marginBottom: 4
	},
	title: {
		fontSize: 16,
		marginBottom: 0
	},
	overflowButton: {
		padding: 4,
		borderRadius: 12,
		marginLeft: 8,
		justifyContent: 'center',
		alignItems: 'center'
	},
	menuContainer: {
		backgroundColor: 'white',
		borderRadius: 8,
		paddingVertical: 4,
		minWidth: 120,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	},
	menuOption: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 8,
		minHeight: 36
	},
	menuIcon: {
		marginRight: 8
	},
	menuText: {
		fontSize: 14,
		fontWeight: '500'
	},
	optionRow: { marginBottom: 16 },
	optionButton: {
		backgroundColor: '#112D4E', // dark navy
		borderRadius: 999,
		paddingVertical: 8,
		paddingHorizontal: 24,
		marginBottom: 2
	},
	optionText: { color: 'white', fontWeight: 'bold' },
	result: { color: '#888', fontSize: 12, marginTop: 2, marginBottom: 8 },
	voters: { color: '#888', fontSize: 12, marginTop: 2 },
	timestamp: { fontSize: 12, color: '#888', marginTop: 8, alignSelf: 'flex-end' }
});

export default PollBubble247;
