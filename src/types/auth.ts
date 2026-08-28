export interface PublicUser {
  id: string;
  username: string;
  email: string;
  eloRating: number;
  wins: number;
  losses: number;
  gamesPlayed: number;
  createdAt: number;
}

export interface AuthSession {
  user: PublicUser;
}

export type AuthenticatedSocketUser = PublicUser;
