// Typed constants for every Socket.IO event name used in the app.
// Using constants (rather than raw strings) catches typos at compile time
// and makes grep-based navigation trivial.
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  LOBBY_UPDATE: 'lobby:update',
  LOBBY_PLAYER_JOINED: 'lobby:player_joined',
  LOBBY_PLAYER_LEFT: 'lobby:player_left',
  LOBBY_COUNTDOWN: 'lobby:countdown',
  LOBBY_JOIN: 'lobby:join',
  LOBBY_LEAVE: 'lobby:leave',
  LOBBY_READY: 'lobby:ready',

  MATCH_START: 'match:start',
  MATCH_STATE: 'match:state',
  MATCH_END: 'match:end',

  ROUND_START: 'round:start',
  ROUND_END: 'round:end',
  ROUND_TICK: 'round:tick',

  ANSWER_SUBMIT: 'answer:submit',
  ANSWER_RESULT: 'answer:result',

  SCORE_UPDATE: 'score:update',

  ERROR: 'error',
} as const;

export type SocketEventValue = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
