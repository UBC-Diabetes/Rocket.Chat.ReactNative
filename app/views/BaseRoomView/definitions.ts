import { EdgeInsets } from 'react-native-safe-area-context';
import { IBaseScreen, ILastMessage, ILoggedUser, TSubscriptionModel, ICustomEmojis, TMessageAction } from '../../definitions';
import { IActionSheetProvider } from '../../containers/ActionSheet';
import { ChatsStackParamList } from '../../stacks/types';

export interface IBaseRoomViewProps extends IActionSheetProvider, IBaseScreen<ChatsStackParamList, 'RoomView'> {
  user: Pick<ILoggedUser, 'id' | 'username' | 'token' | 'showMessageInMainThread'>;
  useRealName?: boolean;
  isAuthenticated: boolean;
  Message_GroupingPeriod?: number;
  Message_TimeFormat?: string;
  Message_Read_Receipt_Enabled?: boolean;
  Hide_System_Messages?: string[];
  baseUrl: string;
  serverVersion: string | null;
  customEmojis: ICustomEmojis;
  isMasterDetail: boolean;
  replyBroadcast: Function;
  width: number;
  insets: EdgeInsets;
  transferLivechatGuestPermission?: string[];
  viewCannedResponsesPermission?: string[];
  livechatAllowManualOnHold?: boolean;
  inAppFeedback?: { [key: string]: string };
  encryptionEnabled: boolean;
  airGappedRestrictionRemainingDays: number | undefined;
}

export interface IBaseRoomViewState {
  joined: boolean;
  room: TSubscriptionModel | {
    rid: string;
    t: string;
    name?: string;
    fname?: string;
    prid?: string;
    joinCodeRequired?: boolean;
    status?: string;
    lastMessage?: ILastMessage;
    sysMes?: boolean;
    onHold?: boolean;
  };
  roomUpdate: {
    [key: string]: any;
  };
  member: any;
  lastOpen: Date | null;
  reactionsModalVisible: boolean;
  canAutoTranslate: boolean;
  loading: boolean;
  replyWithMention: boolean;
  readOnly: boolean;
  unreadsCount: number | null;
  roomUserId?: string | null;
  action: TMessageAction;
  selectedMessages: string[];
  canViewCannedResponse: boolean;
  canForwardGuest: boolean;
  canReturnQueue: boolean;
  canPlaceLivechatOnHold: boolean;
  isOnHold: boolean;
  rightButtonsWidth: number;
} 