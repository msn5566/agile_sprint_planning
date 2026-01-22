
import React from 'react';
import { UserRole, IssueType, IssueStatus, Priority, User, Issue, Sprint, Team, TeamMember } from './types';

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Alex River', avatar: 'https://picsum.photos/seed/alex/100', role: UserRole.ADMIN, email: 'alex@agileflow.com' },
  { id: '2', name: 'Jordan Smith', avatar: 'https://picsum.photos/seed/jordan/100', role: UserRole.SCRUM_MASTER, email: 'jordan@agileflow.com' },
  { id: '3', name: 'Casey Chen', avatar: 'https://picsum.photos/seed/casey/100', role: UserRole.DEVELOPER, email: 'casey@agileflow.com' },
  { id: '4', name: 'Sam Taylor', avatar: 'https://picsum.photos/seed/sam/100', role: UserRole.DEVELOPER, email: 'sam@agileflow.com' },
];

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  { ...MOCK_USERS[0], capacity: 8, focusFactor: 0.5 },
  { ...MOCK_USERS[1], capacity: 12, focusFactor: 0.9 },
  { ...MOCK_USERS[2], capacity: 20, focusFactor: 1.0 },
  { ...MOCK_USERS[3], capacity: 18, focusFactor: 1.0 },
];

export const MOCK_SPRINTS: Sprint[] = [
  { id: 's1', name: 'Sprint 24 - Checkout Flow', startDate: '2024-05-01', endDate: '2024-05-14', goal: 'Complete payment gateway integration and mobile responsive checkout.', status: 'ACTIVE' },
  { id: 's2', name: 'Sprint 25 - Account Revamp', startDate: '2024-05-15', endDate: '2024-05-28', goal: 'Redesign user profile and security settings dashboard.', status: 'FUTURE' },
];

export const MOCK_BACKLOG: Issue[] = [
  { id: 'i1', key: 'AF-101', title: 'Implement Stripe Elements', description: 'Integrate secure payment forms.', type: IssueType.STORY, status: IssueStatus.TODO, priority: Priority.HIGH, storyPoints: 5, reporter: MOCK_USERS[1], sprintId: 's1', createdAt: '2024-04-20' },
  { id: 'i2', key: 'AF-102', title: 'Bug: Payment failure on iOS', description: 'Users reporting crashes when using Apple Pay.', type: IssueType.BUG, status: IssueStatus.IN_PROGRESS, priority: Priority.CRITICAL, storyPoints: 3, reporter: MOCK_USERS[2], assignee: MOCK_USERS[2], sprintId: 's1', createdAt: '2024-04-22' },
  { id: 'i3', key: 'AF-103', title: 'Design new profile page', description: 'Create Figma mocks for the profile update.', type: IssueType.STORY, status: IssueStatus.BACKLOG, priority: Priority.MEDIUM, storyPoints: 2, reporter: MOCK_USERS[0], createdAt: '2024-04-25' },
  { id: 'i4', key: 'AF-104', title: 'API Documentation Update', description: 'Document new endpoints for v2.0.', type: IssueType.TASK, status: IssueStatus.BACKLOG, priority: Priority.LOW, storyPoints: 1, reporter: MOCK_USERS[3], createdAt: '2024-04-28' },
];

export const MOCK_TEAMS: Team[] = [
  { id: 't1', name: 'Product Engineering', description: 'Core product development and backend services.', members: MOCK_TEAM_MEMBERS, sprints: MOCK_SPRINTS, velocity: 24 },
  { id: 't2', name: 'Marketing & Ops', description: 'External communications and operational workflows.', members: [MOCK_TEAM_MEMBERS[0], MOCK_TEAM_MEMBERS[1]], sprints: [], velocity: 15 },
];

export const Icons = {
  Story: () => (
    <div className="bg-emerald-500 rounded p-0.5 text-white">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
    </div>
  ),
  Task: () => (
    <div className="bg-blue-500 rounded p-0.5 text-white">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
    </div>
  ),
  Bug: () => (
    <div className="bg-red-500 rounded p-0.5 text-white">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
    </div>
  ),
  Epic: () => (
    <div className="bg-purple-500 rounded p-0.5 text-white">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    </div>
  )
};
