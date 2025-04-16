import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { Subscription } from 'rxjs';
import { Q } from '@nozbe/watermelondb';

import { getRoutingConfig } from '../../lib/services/restApi';
import database from '../../lib/database';
import Message from '../../containers/message';
import MessageActions from '../../containers/MessageActions';
import MessageErrorActions from '../../containers/MessageErrorActions';
import log, { events, logEvent } from '../../lib/methods/helpers/log';
import EventEmitter from '../../lib/methods/helpers/events';
import I18n from '../../i18n';
import RoomHeader from '../../containers/RoomHeader';
import StatusBar from '../../containers/StatusBar';
import ReactionsList from '../../containers/ReactionsList';
import { LISTENER } from '../../containers/Toast';
import { getBadgeColor, isBlocked, makeThreadName } from '../../lib/methods/helpers/room';
import { getUidDirectMessage } from '../../lib/methods/helpers/helpers';
import { isReadOnly } from '../../lib/methods/helpers/isReadOnly';
import { showErrorAlert } from '../../lib/methods/helpers/info';
import { withTheme } from '../../theme';
import { Review } from '../../lib/methods/helpers/review';
import RoomClass from '../../lib/methods/subscriptions/room';
import { getUserSelector } from '../../selectors/login';
import Navigation from '../../lib/navigation/appNavigation';
import SafeAreaView from '../../containers/SafeAreaView';
import { withDimensions } from '../../dimensions';
import { takeInquiry, takeResume } from '../../ee/omnichannel/lib';
import { sendLoadingEvent } from '../../containers/Loading';
import { IRoomViewProps, IRoomViewState } from '../RoomView/definitions';
import { roomAttrsUpdate, stateAttrsUpdate } from '../RoomView/constants';
import { themes } from '../../lib/constants';
import { RoomContext } from '../RoomView/context';
import { IListContainerRef, TListRef } from '../RoomView/List/definitions';
import { IJoinCode } from '../RoomView/JoinCode';
import { ISubscription, SubscriptionType, TSubscriptionModel, TAnyMessageModel, IVisitor } from '../../definitions';
import { IMessageComposerRef } from '../../containers/MessageComposer';
import { IOmnichannelSource } from '../../definitions/IRoom';
import { IServedBy } from '../../definitions/IServedBy';

// Import components from RoomView
import List from '../RoomView/List';
import JoinCode from '../RoomView/JoinCode';
import Banner from '../RoomView/Banner';
import UploadProgress from '../RoomView/UploadProgress';

type TRoom = {
  rid: string;
  t: SubscriptionType;
  name?: string;
  fname?: string;
  prid?: string;
  announcement?: string;
  bannerClosed?: boolean;
  isRoom247Chatroom?: boolean;
  joinCodeRequired?: boolean;
  status?: string;
  lastMessage?: any;
  sysMes?: boolean;
  onHold?: boolean;
  _id?: string;
  id?: string;
  _updatedAt?: string;
  v?: IVisitor;
  f?: boolean;
  ts?: string | Date;
  ls?: Date;
  open?: boolean;
  alert?: boolean;
  roles?: string[];
  unread?: number;
  lm?: string;
  lr?: string;
  userMentions?: number;
  groupMentions?: number;
  tunread?: string[];
  tunreadUser?: string[];
  tunreadGroup?: string[];
  roomUpdatedAt?: Date | number;
  ro?: boolean;
  lastOpen?: Date;
  description?: string;
  topic?: string;
  blocked?: boolean;
  blocker?: boolean;
  reactWhenReadOnly?: boolean;
  archived?: boolean;
  muted?: string[];
  unmuted?: string[];
  ignored?: string[];
  broadcast?: boolean;
  draftMessage?: string | null;
  lastThreadSync?: Date;
  jitsiTimeout?: Date;
  autoTranslate?: boolean;
  autoTranslateLanguage?: string;
  hideUnreadStatus?: boolean;
  uids?: string[];
  usernames?: string[];
  visitor?: IVisitor;
  departmentId?: string;
  servedBy?: IServedBy;
  livechatData?: any;
  tags?: string[];
  E2EKey?: string;
  E2ESuggestedKey?: string | null;
  encrypted?: boolean;
  e2eKeyId?: string;
  avatarETag?: string;
  teamId?: string;
  teamMain?: boolean;
  separator?: boolean;
  source?: IOmnichannelSource;
  hideMentionStatus?: boolean;
  usersCount?: number;
  disableNotifications?: boolean;
} | TSubscriptionModel;

const BaseRoomView: React.FC<IRoomViewProps> = ({
  route,
  navigation,
  user,
  baseUrl,
  theme,
  width,
  serverVersion,
  encryptionEnabled,
  isMasterDetail,
  insets,
  ...props
}) => {
  // Refs
  const messageComposerRef = useRef<IMessageComposerRef>(null);
  const list = useRef<IListContainerRef>(null);
  const flatList = useRef<FlatList<TAnyMessageModel>>(null);
  const joinCode = useRef<IJoinCode>(null);

  // State
  const [state, setState] = useState<IRoomViewState>({
    joined: true,
    room: route.params?.room ?? {
      _id: route.params?.rid || '',
      id: route.params?.rid || '',
      rid: route.params?.rid || '',
      t: route.params?.t || SubscriptionType.CHANNEL,
      name: route.params?.name || '',
      fname: route.params?.fname,
      prid: route.params?.prid,
      f: false,
      ts: new Date(),
      ls: new Date(),
      open: true,
      alert: false,
      unread: 0,
      userMentions: 0,
      groupMentions: 0,
      archived: false,
      tunread: [],
      tunreadUser: [],
      tunreadGroup: [],
      roomUpdatedAt: new Date(),
      ro: false,
      lastOpen: new Date(),
      description: '',
      topic: '',
      blocked: false,
      blocker: false,
      reactWhenReadOnly: false,
      muted: [],
      unmuted: [],
      ignored: [],
      broadcast: false,
      draftMessage: null,
      lastThreadSync: new Date(),
      jitsiTimeout: new Date(),
      autoTranslate: false,
      autoTranslateLanguage: '',
      hideUnreadStatus: false,
      uids: [],
      usernames: [],
      visitor: undefined,
      departmentId: '',
      servedBy: undefined,
      livechatData: undefined,
      tags: [],
      E2EKey: '',
      E2ESuggestedKey: null,
      encrypted: false,
      e2eKeyId: '',
      avatarETag: '',
      teamId: '',
      teamMain: false,
      separator: false,
      source: undefined,
      hideMentionStatus: false,
      usersCount: 0,
      disableNotifications: false,
      announcement: '',
      bannerClosed: false,
      isRoom247Chatroom: false,
      lm: '',
      lr: '',
      messages: { fetch: async () => [] },
      threads: { fetch: async () => [] },
      threadMessages: { fetch: async () => [] },
      uploads: { fetch: async () => [] },
      unsubscribe: async () => {}
    } as Partial<ISubscription>,
    roomUpdate: {},
    member: {},
    lastOpen: null,
    reactionsModalVisible: false,
    selectedMessages: route.params?.messageId ? [route.params.messageId] : [],
    action: route.params?.messageId ? 'quote' : null,
    canAutoTranslate: false,
    loading: true,
    replyWithMention: false,
    readOnly: false,
    unreadsCount: null,
    roomUserId: route.params?.roomUserId ?? (route.params?.room ? getUidDirectMessage(route.params.room) : null),
    canViewCannedResponse: false,
    canForwardGuest: false,
    canReturnQueue: false,
    canPlaceLivechatOnHold: false,
    isOnHold: false,
    rightButtonsWidth: 0
  });

  // Refs for subscriptions
  const subSubscription = useRef<Subscription>();
  const sub = useRef<RoomClass>();
  const mounted = useRef(false);

  // Destructure state for easier access
  const { room, loading, action, selectedMessages } = state;
  const { rid, t } = room;
  const tmid = route.params?.tmid;

  useEffect(() => {
    mounted.current = true;
    setHeader();

    if ('id' in room) {
      observeRoom(room as TSubscriptionModel);
    } else if (rid) {
      findAndObserveRoom(rid);
    }

    setReadOnly();

    if (t === SubscriptionType.OMNICHANNEL) {
      updateOmnichannel();
    }

    if (rid && !tmid) {
      sub.current = new RoomClass(rid);
    }

    return () => {
      mounted.current = false;
      unsubscribe();
    };
  }, []);

  const setHeader = () => {
    // Implementation of header setting logic
  };

  const observeRoom = (room: TSubscriptionModel) => {
    if (subSubscription.current) {
      subSubscription.current.unsubscribe();
      subSubscription.current = undefined;
    }

    if (!mounted.current) return;

    const observable = room.observe();
    subSubscription.current = observable.subscribe((changes: TSubscriptionModel) => {
      const roomUpdate = roomAttrsUpdate.reduce((ret: any, attr) => {
        ret[attr] = changes[attr];
        return ret;
      }, {});

      if (mounted.current) {
        setState(prev => ({
          ...prev,
          room: changes,
          roomUpdate,
          isOnHold: !!changes?.onHold
        }));
      }
    });
  };

  const findAndObserveRoom = async (rid: string) => {
    try {
      const db = database.active;
      const subCollection = await db.get('subscriptions');
      const room = await subCollection.find(rid);
      setState(prev => ({ ...prev, room }));
      if (!tmid) {
        setHeader();
      }
      observeRoom(room);
    } catch (error) {
      if (t !== SubscriptionType.DIRECT) {
        console.log('Room not found');
        setState(prev => ({ ...prev, joined: false }));
      }
      if (rid) {
        observeSubscriptions();
      }
    }
  };

  const observeSubscriptions = () => {
    try {
      const db = database.active;
      const observeSubCollection = db
        .get('subscriptions')
        .query(Q.where('rid', rid))
        .observe();
      subSubscription.current = observeSubCollection.subscribe(data => {
        if (data[0]) {
          if (subSubscription.current && subSubscription.current.unsubscribe) {
            observeRoom(data[0]);
            setState(prev => ({ ...prev, room: data[0], joined: true }));
            subSubscription.current.unsubscribe();
          }
        }
      });
    } catch (e) {
      console.log("observeSubscriptions: Can't find subscription to observe");
    }
  };

  const unsubscribe = async () => {
    if (sub.current?.unsubscribe) {
      await sub.current.unsubscribe();
    }
    delete sub.current;
  };

  const setReadOnly = async () => {
    const readOnly = await isReadOnly(room, user.username);
    setState(prev => ({ ...prev, readOnly }));
  };

  const updateOmnichannel = async () => {
    // Implementation of omnichannel update logic
  };

  const handleSendMessage = async (message: string) => {
    // Implementation of message sending logic
  };

  const onJoin = () => {
    setState(prev => ({
      ...prev,
      joined: true
    }));
  };

  const renderItem = ({ item }: { item: any }) => {
    // Implementation of message item rendering
    return null;
  };

  const renderFooter = () => {
    // Implementation of footer rendering
    return null;
  };

  const renderActions = () => {
    // Implementation of actions rendering
    return null;
  };

  return (
    <RoomContext.Provider
      value={{
        rid,
        t,
        tmid,
        sharing: false,
        action,
        selectedMessages,
        onRemoveQuoteMessage: () => {}, // Implement these handlers
        editCancel: () => {},
        editRequest: () => {},
        onSendMessage: handleSendMessage,
        setQuotesAndText: () => {},
        getText: () => messageComposerRef.current?.getText()
      }}>
      <SafeAreaView style={{ backgroundColor: themes[theme].backgroundColor }} testID='room-view'>
        <StatusBar />
        <Banner
          title={I18n.t('Announcement')}
          text={room.announcement}
          bannerClosed={room.bannerClosed}
          closeBanner={() => {}}
        />
        <List
          ref={list}
          listRef={flatList}
          rid={rid}
          tmid={tmid}
          renderRow={renderItem}
          loading={loading}
          hideSystemMessages={[]}
          showMessageInMainThread={user.showMessageInMainThread ?? false}
          serverVersion={serverVersion}
        />
        {renderFooter()}
        {renderActions()}
        <UploadProgress rid={rid} user={user} baseUrl={baseUrl} width={width} />
        <JoinCode ref={joinCode} onJoin={onJoin} rid={rid} t={t} theme={theme} />
      </SafeAreaView>
    </RoomContext.Provider>
  );
};

const mapStateToProps = (state: any) => ({
  user: getUserSelector(state)
});

export default connect(mapStateToProps)(
  withTheme(withDimensions(withSafeAreaInsets(BaseRoomView)))
); 