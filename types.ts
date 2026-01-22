
export enum UserRole {
  ADMIN = 'Admin',
  SCRUM_MASTER = 'Scrum Master',
  DEVELOPER = 'Developer'
}

export enum IssueType {
  STORY = 'Story',
  BUG = 'Bug',
  TASK = 'Task',
  EPIC = 'Epic'
}

export enum IssueStatus {
  BACKLOG = 'Backlog',
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  email: string;
}

// Added individual capacity and focus factor
export interface TeamMember extends User {
  capacity: number; // Sprint capacity in points/hours
  focusFactor: number; // 0.0 to 1.0 (e.g. 0.8 for 80% focus)
}

export interface Issue {
  id: string;
  key: string;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  priority: Priority;
  storyPoints: number;
  assignee?: User;
  reporter: User;
  createdAt: string;
  sprintId?: string;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal: string;
  status: 'FUTURE' | 'ACTIVE' | 'CLOSED';
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[]; // Updated to TeamMember
  sprints: Sprint[];
  velocity: number;
  description?: string;
}
