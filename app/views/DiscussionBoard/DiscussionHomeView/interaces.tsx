export enum DiscussionTabs {
	DISCUSSION_BOARDS = 0,
	SAVED_POSTS = 1
}

export type DiscussionHeaderProps = {
	onTabChange: (tab: DiscussionTabs) => void;
};

export type DiscussionBoardCardProps = {
	title: string;
	description: string;
	saved?: boolean;
	icon?: string;
	color?: string;
	onSaveClick?: Function;
	onPress?: Function;
};

export type SavedPostCardProps = {
	user: {
		name: string;
		profile_image: string;
	};
	date: string;
	title: string;
	description: string;
	image?: string;
	likes?: number;
	comments?: number;
	saved?: boolean;
	onSaveClick?: Function;
	onPress?: Function;
};
