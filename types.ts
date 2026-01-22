
export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  CO_TEACHER = 'CO_TEACHER'
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  role: UserRole;
  isFlagged?: boolean;
  flagReason?: string;
}

export interface RoomState {
  id: string;
  code: string;
  className: string;
  isActive: boolean;
}

export type ViewState = 'LANDING' | 'FORM' | 'CLASSROOM' | 'END';

export interface ModerationAlert {
  id: string;
  user: string;
  reason: string;
  timestamp: Date;
}
