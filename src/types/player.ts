export type PlayerStatus = 'idle' | 'in_lobby' | 'in_match' | 'spectating';

export interface Player {
  id: string;
  username: string;
  avatarUrl: string | null;
  status: PlayerStatus;
  rating: number;
  wins: number;
  losses: number;
  createdAt: number;
}

// LocalPlayer is the authenticated client-side representation of the current user.
// The sessionToken is never sent back to the server as a plain field; it lives
// only in client-side state and is attached to requests via headers/cookies.
export interface LocalPlayer extends Player {
  sessionToken: string;
}
