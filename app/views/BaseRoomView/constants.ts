export const stateAttrsUpdate = [
  'joined',
  'lastOpen',
  'reactionsModalVisible',
  'canAutoTranslate',
  'loading',
  'editing',
  'readOnly',
  'member',
  'canForwardGuest',
  'canReturnQueue',
  'canViewCannedResponse',
  'rightButtonsWidth'
] as const;

export const roomAttrsUpdate = [
  'name',
  'fname',
  'topic',
  'announcement',
  'description',
  'status',
  'lastMessage',
  'sysMes',
  'ro',
  'reactWhenReadOnly',
  'archived',
  'joinCodeRequired',
  'broadcast',
  'encrypted',
  'e2eKeyId',
  'onHold',
  'bannerClosed',
  'visitor',
  'departmentId',
  'servedBy',
  'livechatData',
  'teamMain',
  'teamId',
  'prid',
  'usersCount',
  'ignored'
] as const;

export type TStateAttrsUpdate = typeof stateAttrsUpdate[number];
export type TRoomUpdate = typeof roomAttrsUpdate[number]; 