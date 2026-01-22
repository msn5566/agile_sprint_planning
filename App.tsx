
import React, { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { PlanningBoard } from './components/PlanningBoard';
import { BacklogManager } from './components/BacklogManager';
import { TeamManagement } from './components/TeamManagement';
import { SprintReports } from './components/SprintReports';
import { 
  MOCK_USERS, 
  MOCK_TEAMS, 
  MOCK_BACKLOG, 
  MOCK_SPRINTS 
} from './constants';
import { User, Team, UserRole, Sprint, Issue, IssueStatus, IssueType, Priority, TeamMember } from './types';

type ViewType = 'dashboard' | 'backlog' | 'teams' | 'reports';

const App: React.FC = () => {
  const [activeUser, setActiveUser] = useState<User>(MOCK_USERS[1]);
  const [activeTeamId, setActiveTeamId] = useState<string>(MOCK_TEAMS[0].id);
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  const [issues, setIssues] = useState<Issue[]>(MOCK_BACKLOG);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  const activeTeam = useMemo(() => 
    teams.find(t => t.id === activeTeamId) || teams[0], [teams, activeTeamId]
  );

  const canManageSprint = activeUser.role === UserRole.ADMIN || activeUser.role === UserRole.SCRUM_MASTER;

  const currentSprint = useMemo(() => 
    activeTeam.sprints.find(s => s.status === 'ACTIVE'), [activeTeam]
  );

  const handleUpdateIssue = (id: string, updates: Partial<Issue>) => {
    setIssues(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const handleDeleteIssues = (ids: string[]) => {
    setIssues(prev => prev.filter(i => !ids.includes(i.id)));
  };

  const handleCreateIssue = (data: Partial<Issue>) => {
    const newId = `i-${Date.now()}`;
    const newKey = `AF-${100 + issues.length + 1}`;
    const newIssue: Issue = {
      id: newId,
      key: newKey,
      title: data.title || 'Untitled Issue',
      description: data.description || '',
      type: data.type || IssueType.STORY,
      status: data.status || IssueStatus.BACKLOG,
      priority: data.priority || Priority.MEDIUM,
      storyPoints: data.storyPoints || 1,
      reporter: activeUser,
      assignee: data.assignee,
      createdAt: new Date().toISOString().split('T')[0],
      sprintId: data.sprintId,
    };
    setIssues(prev => [newIssue, ...prev]);
  };

  const handleMoveToSprint = (issueId: string) => {
    if (!currentSprint) {
      alert("No active sprint to move items to. Please start a sprint first.");
      return;
    }
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, sprintId: currentSprint.id, status: IssueStatus.TODO } : i));
  };

  const handleMoveToBacklog = (issueId: string) => {
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, sprintId: undefined, status: IssueStatus.BACKLOG } : i));
  };

  const handleUpdateTeam = (teamId: string, updates: Partial<Team>) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, ...updates } : t));
  };

  const handleStartSprint = () => {
    if (!currentSprint) return;
    const updatedSprints = activeTeam.sprints.map(s => 
      s.id === currentSprint.id ? { ...s, status: 'ACTIVE' as const } : s
    );
    handleUpdateTeam(activeTeam.id, { sprints: updatedSprints });
    alert(`${currentSprint.name} has officially started!`);
  };

  const handleCompleteSprint = () => {
    if (!currentSprint) return;
    
    // 1. Move unfinished items back to backlog
    const unfinishedIds = issues
      .filter(i => i.sprintId === currentSprint.id && i.status !== IssueStatus.DONE)
      .map(i => i.id);
      
    setIssues(prev => prev.map(i => 
      unfinishedIds.includes(i.id) 
        ? { ...i, sprintId: undefined, status: IssueStatus.BACKLOG } 
        : i
    ));

    // 2. Mark sprint as CLOSED
    const updatedSprints = activeTeam.sprints.map(s => 
      s.id === currentSprint.id ? { ...s, status: 'CLOSED' as const } : s
    );
    handleUpdateTeam(activeTeam.id, { sprints: updatedSprints });
    
    alert(`Sprint completed! ${unfinishedIds.length} unfinished items rolled back to backlog.`);
    setActiveView('reports');
  };

  const handleAddTeam = (name: string) => {
    const newTeam: Team = {
      id: `t-${Date.now()}`,
      name,
      description: 'New agile team created in workspace.',
      members: [],
      sprints: [],
      velocity: 0
    };
    setTeams(prev => [...prev, newTeam]);
    setActiveTeamId(newTeam.id);
  };

  return (
    <Layout 
      activeUser={activeUser} 
      onUserChange={setActiveUser}
      users={MOCK_USERS}
      activeTeam={activeTeam}
      onTeamChange={(team) => {
        setActiveTeamId(team.id);
        setActiveView('dashboard');
      }}
      teams={teams}
      activeView={activeView}
      onNavigate={setActiveView}
    >
      {activeView === 'dashboard' && (
        <Dashboard 
          team={activeTeam} 
          currentSprint={currentSprint} 
          issues={issues} 
          onNavigate={setActiveView} 
          onCompleteSprint={handleCompleteSprint}
        />
      )}
      {activeView === 'backlog' && (
        <PlanningBoard 
          team={activeTeam}
          sprint={currentSprint || activeTeam.sprints[0]}
          backlogIssues={issues.filter(i => !i.sprintId)}
          sprintIssues={issues.filter(i => i.sprintId === currentSprint?.id)}
          onMoveToSprint={handleMoveToSprint}
          onMoveToBacklog={handleMoveToBacklog}
          isLocked={currentSprint?.status === 'ACTIVE'}
          onLock={handleStartSprint}
        />
      )}
      {activeView === 'teams' && (
        <TeamManagement 
          teams={teams}
          allUsers={MOCK_USERS}
          activeTeam={activeTeam}
          onUpdateTeam={handleUpdateTeam}
          onAddTeam={handleAddTeam}
          onDeleteTeam={(id) => setTeams(prev => prev.filter(t => t.id !== id))}
        />
      )}
      {activeView === 'reports' && (
        <SprintReports 
          team={activeTeam}
          issues={issues}
        />
      )}
    </Layout>
  );
};

export default App;
