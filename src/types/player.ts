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

export interface LocalPlayer extends Player {
  identityKind: 'guest' | 'authenticated';
  email?: string;
  gamesPlayed?: number;
}
