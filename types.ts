export enum Role {
  USER = 'user',
  ASSISTANT = 'assistant'
}

export interface WebSource {
  uri: string;
  title?: string;
}

export interface GroundingChunk {
  web: WebSource;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
  groundingMetadata?: GroundingChunk[];
  imageUrl?: string | null;
  generatedImages?: string[];
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  isTemporary?: boolean;
}

export interface User {
  name: string;
  email: string;
  picture: string;
}

// Lifemap Feature Types
export enum LifemapEntryType {
    CHECK_IN = 'check-in',
    NOTE = 'note',
    GOAL_CREATED = 'goal-created',
    GOAL_UPDATE = 'goal-update'
}

export interface LifemapEntry {
    id: string;
    timestamp: number;
    type: LifemapEntryType;
    content: string;
    mood?: string; // e.g., 'happy', 'sad', 'productive'
    tags?: string[];
    relatedGoalId?: string;
}

export interface Goal {
    id: string;
    title: string;
    description: string;
    createdAt: number;
    targetDate?: number;
    status: 'active' | 'completed' | 'archived';
}
