/**
 * 주간 리포트 자동 생성 스크립트
 *
 * 데이터 소스: GitHub Issues/Projects (gh CLI 사용)
 *
 * 사용법:
 * - 수동: npx ts-node generate-reports.ts
 * - 자동: GitHub Actions 스케줄
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// ============================================
// 설정
// ============================================

interface Config {
  github: {
    org: string;
    projectNumber: number; // GitHub Projects 번호
  };
  projects: string[]; // 프로젝트명 (랜드, 오피스 등)
  outputDir: string;
}

const config: Config = {
  github: {
    org: 'semicolon-devteam',
    projectNumber: 1, // 이슈관리 보드 번호
  },
  projects: [], // GitHub Projects에서 자동으로 가져옴
  outputDir: path.join(__dirname, '..'),
};

// ============================================
// 타입 정의
// ============================================

interface GitHubIssue {
  number: number;
  title: string;
  body: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  labels: { name: string }[];
  assignees: { login: string }[];
  repository: { name: string };
  milestone: { title: string } | null;
}

interface ProjectItem {
  content: GitHubIssue;
  status: string;
  priority: string;
  project: string;
  iteration: string;
}

interface ReportData {
  period: { start: Date; end: Date };
  projects: string[];
  generatedAt: Date;

  // PO 리포트 데이터
  po: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    blockedTasks: number;
    completionRate: number;
    tasksByStatus: Record<string, number>;
    tasksByProject: Record<string, { total: number; completed: number }>;
    epics: ProjectItem[];
    priorityDistribution: Record<string, number>;
    criticalIssues: ProjectItem[];
    weeklyComparison: {
      tasks: { current: number; previous: number; change: number };
      completionRate: { current: number; previous: number; change: number };
    };
  };

  // 운영자 리포트 데이터
  ops: {
    newBugs: number;
    resolvedBugs: number;
    openBugs: number;
    bugsBySeverity: Record<string, number>;
    bugsByProject: Record<string, number>;
    criticalBugs: ProjectItem[];
    feedbacks: ProjectItem[];
    feedbacksByCategory: Record<string, number>;
    deployments: { project: string; env: string; version: string; date: string; author: string }[];
    deploymentsByEnv: Record<string, number>;
    weeklyBugTrend: number[];
    alerts: { type: 'critical' | 'warning' | 'info'; title: string; description: string }[];
  };
}

// ============================================
// GitHub CLI 유틸리티
// ============================================

function ghCommand(args: string): string {
  try {
    return execSync(`gh ${args}`, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
  } catch (error: any) {
    console.error(`gh 명령 실패: ${args}`);
    console.error(error.message);
    return '[]';
  }
}

// ============================================
// 데이터 조회
// ============================================

function fetchProjectItems(): ProjectItem[] {
  console.log('GitHub Projects 데이터 조회 중...');

  // GitHub Projects에서 모든 아이템 조회
  const result = ghCommand(
    `project item-list ${config.github.projectNumber} --owner ${config.github.org} --format json --limit 500`
  );

  try {
    const data = JSON.parse(result);
    return (data.items || []).map((item: any) => ({
      content: {
        number: item.content?.number || 0,
        title: item.title || item.content?.title || '',
        body: item.content?.body || '',
        state: item.content?.state || 'open',
        createdAt: item.content?.createdAt || '',
        updatedAt: item.content?.updatedAt || '',
        closedAt: item.content?.closedAt || null,
        labels: item.labels || [],
        assignees: item.content?.assignees || [],
        repository: item.content?.repository || { name: 'unknown' },
        milestone: item.content?.milestone || null,
      },
      status: item.status || item['Status'] || '대기중',
      priority: item.priority || item['Priority'] || item['우선순위'] || 'P3(낮음)',
      // Repository URL에서 프로젝트명 추출 (예: https://github.com/semicolon-devteam/core-backend → core-backend)
      project: (() => {
        const repoUrl = item.repository || item['Repository'] || '';
        if (typeof repoUrl === 'string' && repoUrl.includes('/')) {
          return repoUrl.split('/').pop() || '미분류';
        }
        return '미분류';
      })(),
      iteration: item.iteration || item['Iteration'] || '',
    }));
  } catch (e) {
    console.error('Projects 데이터 파싱 실패:', e);
    return [];
  }
}

function fetchRepoIssues(repo: string, state: string = 'all', labels: string = ''): GitHubIssue[] {
  const labelArg = labels ? `--label "${labels}"` : '';
  const result = ghCommand(
    `issue list --repo ${config.github.org}/${repo} --state ${state} ${labelArg} --json number,title,body,state,createdAt,updatedAt,closedAt,labels,assignees,milestone --limit 200`
  );

  try {
    return JSON.parse(result) || [];
  } catch (e) {
    return [];
  }
}

function fetchOrgIssues(state: string = 'open', labels: string = ''): GitHubIssue[] {
  // 조직 전체 이슈 검색
  const labelQuery = labels ? `label:${labels}` : '';
  const stateQuery = state === 'all' ? '' : `state:${state}`;
  const query = `org:${config.github.org} is:issue ${stateQuery} ${labelQuery}`.trim();

  const result = ghCommand(
    `search issues "${query}" --json number,title,body,state,createdAt,updatedAt,closedAt,labels,assignees,repository --limit 300`
  );

  try {
    return JSON.parse(result) || [];
  } catch (e) {
    return [];
  }
}

function fetchRecentDeployments(): { project: string; env: string; version: string; date: string; author: string }[] {
  // GitHub Releases에서 최근 배포 정보 조회
  const deployments: any[] = [];

  // 주요 레포에서 릴리즈 조회
  const repos = ['land', 'office', 'semo']; // 실제 레포명으로 수정 필요

  for (const repo of repos) {
    try {
      const result = ghCommand(
        `release list --repo ${config.github.org}/${repo} --limit 5 --json tagName,publishedAt,author,name`
      );
      const releases = JSON.parse(result) || [];

      releases.forEach((r: any) => {
        // 태그명에서 환경 추출 (예: v1.0.0-stg, v1.0.0-prd)
        let env = 'prd';
        if (r.tagName?.includes('-stg')) env = 'stg';
        if (r.tagName?.includes('-dev')) env = 'dev';

        deployments.push({
          project: repo,
          env,
          version: r.tagName || '',
          date: r.publishedAt || '',
          author: r.author?.login || 'unknown',
        });
      });
    } catch (e) {
      // 레포가 없거나 릴리즈가 없는 경우 무시
    }
  }

  return deployments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ============================================
// 데이터 집계
// ============================================

function aggregateReportData(
  projectItems: ProjectItem[],
  orgIssues: GitHubIssue[],
  bugIssues: GitHubIssue[],
  feedbackIssues: GitHubIssue[],
  deployments: any[],
  period: { start: Date; end: Date }
): ReportData {
  // 기간 내 이슈 필터링
  const isInPeriod = (dateStr: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return date >= period.start && date <= period.end;
  };

  // PO 데이터 집계
  const allTasks = projectItems.filter(
    (item) => !item.content.labels?.some((l: any) => l.name === 'bug')
  );
  const completedTasks = allTasks.filter((t) =>
    t.status === '안정됨' || t.status === '병합됨' || t.status === 'Done' || t.status === '완료'
  );
  const inProgressTasks = allTasks.filter((t) =>
    t.status === '진행중' || t.status === 'In Progress'
  );
  const blockedTasks = allTasks.filter((t) =>
    t.content.labels?.some((l: any) => l.name === 'blocked' || l.name === '블로커')
  );

  const tasksByStatus: Record<string, number> = {};
  const tasksByProject: Record<string, { total: number; completed: number }> = {};

  allTasks.forEach((task) => {
    // 상태별 집계
    const status = task.status || '대기중';
    tasksByStatus[status] = (tasksByStatus[status] || 0) + 1;

    // 프로젝트별 집계
    const proj = task.project || '미분류';
    if (!tasksByProject[proj]) {
      tasksByProject[proj] = { total: 0, completed: 0 };
    }
    tasksByProject[proj].total++;
    if (completedTasks.includes(task)) {
      tasksByProject[proj].completed++;
    }
  });

  // Epic 필터링 (라벨 또는 제목으로)
  const epics = projectItems.filter(
    (item) =>
      item.content.labels?.some((l: any) => l.name === 'epic' || l.name === 'Epic') ||
      item.content.title?.startsWith('[Epic]')
  );

  // 우선순위 집계
  const priorityDistribution: Record<string, number> = {
    'P0(긴급)': 0,
    'P1(높음)': 0,
    'P2(보통)': 0,
    'P3(낮음)': 0,
  };

  projectItems.forEach((item) => {
    const priority = item.priority || 'P3(낮음)';
    if (priorityDistribution[priority] !== undefined) {
      priorityDistribution[priority]++;
    } else {
      priorityDistribution['P3(낮음)']++;
    }
  });

  // Critical 이슈
  const criticalIssues = projectItems.filter(
    (item) => item.priority === 'P0(긴급)' || item.priority === 'P1(높음)'
  );

  // 운영자 데이터 집계
  const openBugs = bugIssues.filter((b) => b.state === 'OPEN' || b.state === 'open');
  const newBugsThisWeek = bugIssues.filter((b) => isInPeriod(b.createdAt));
  const resolvedBugsThisWeek = bugIssues.filter(
    (b) => (b.state === 'CLOSED' || b.state === 'closed') && isInPeriod(b.closedAt || '')
  );

  const bugsBySeverity: Record<string, number> = {
    critical: 0,
    major: 0,
    minor: 0,
    trivial: 0,
  };

  const bugsByProject: Record<string, number> = {};

  openBugs.forEach((bug) => {
    // 심각도 분류
    const labels = bug.labels?.map((l) => l.name.toLowerCase()) || [];
    if (labels.includes('critical') || labels.includes('p0')) {
      bugsBySeverity.critical++;
    } else if (labels.includes('major') || labels.includes('p1')) {
      bugsBySeverity.major++;
    } else if (labels.includes('minor') || labels.includes('p2')) {
      bugsBySeverity.minor++;
    } else {
      bugsBySeverity.trivial++;
    }

    // 프로젝트별 집계
    const proj = bug.repository?.name || '미분류';
    bugsByProject[proj] = (bugsByProject[proj] || 0) + 1;
  });

  const criticalBugs = projectItems.filter(
    (item) =>
      item.content.labels?.some((l: any) => l.name === 'bug') &&
      (item.priority === 'P0(긴급)' || item.priority === 'P1(높음)')
  );

  // 피드백 집계
  const feedbacksByCategory: Record<string, number> = {
    bug: 0,
    feature: 0,
    improvement: 0,
    question: 0,
  };

  const feedbackItems: ProjectItem[] = feedbackIssues.map((f) => {
    const labels = f.labels?.map((l) => l.name.toLowerCase()) || [];
    if (labels.includes('bug')) feedbacksByCategory.bug++;
    else if (labels.includes('feature') || labels.includes('enhancement')) feedbacksByCategory.feature++;
    else if (labels.includes('improvement')) feedbacksByCategory.improvement++;
    else feedbacksByCategory.question++;

    return {
      content: f,
      status: f.state,
      priority: 'P3(낮음)',
      project: f.repository?.name || '미분류',
      iteration: '',
    };
  });

  // 배포 집계
  const recentDeployments = deployments.filter((d) => isInPeriod(d.date));
  const deploymentsByEnv: Record<string, number> = { dev: 0, stg: 0, prd: 0 };
  recentDeployments.forEach((d) => {
    deploymentsByEnv[d.env] = (deploymentsByEnv[d.env] || 0) + 1;
  });

  // 알림 생성
  const alerts: ReportData['ops']['alerts'] = [];
  criticalBugs.slice(0, 3).forEach((bug) => {
    alerts.push({
      type: 'critical',
      title: `[${bug.project}] ${bug.content.title}`,
      description: `담당: ${bug.content.assignees?.[0]?.login || '미할당'}`,
    });
  });

  // 주간 버그 트렌드 (최근 5주)
  const weeklyBugTrend: number[] = [];
  for (let i = 4; i >= 0; i--) {
    const weekStart = new Date(period.end);
    weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
    const weekEnd = new Date(period.end);
    weekEnd.setDate(weekEnd.getDate() - i * 7);

    const count = bugIssues.filter((b) => {
      const created = new Date(b.createdAt);
      return created >= weekStart && created < weekEnd;
    }).length;
    weeklyBugTrend.push(count);
  }

  const totalTasks = allTasks.length;
  const completedCount = completedTasks.length;

  return {
    period,
    projects: config.projects,
    generatedAt: new Date(),
    po: {
      totalTasks,
      completedTasks: completedCount,
      inProgressTasks: inProgressTasks.length,
      blockedTasks: blockedTasks.length,
      completionRate: totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0,
      tasksByStatus,
      tasksByProject,
      epics,
      priorityDistribution,
      criticalIssues,
      weeklyComparison: {
        tasks: { current: totalTasks, previous: 0, change: 0 },
        completionRate: {
          current: totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0,
          previous: 0,
          change: 0,
        },
      },
    },
    ops: {
      newBugs: newBugsThisWeek.length,
      resolvedBugs: resolvedBugsThisWeek.length,
      openBugs: openBugs.length,
      bugsBySeverity,
      bugsByProject,
      criticalBugs,
      feedbacks: feedbackItems,
      feedbacksByCategory,
      deployments: recentDeployments,
      deploymentsByEnv,
      weeklyBugTrend,
      alerts,
    },
  };
}

// ============================================
// HTML 생성
// ============================================

function generatePOReport(data: ReportData): string {
  const periodStr = `${data.period.start.toLocaleDateString('ko-KR')} ~ ${data.period.end.toLocaleDateString('ko-KR')}`;
  const generatedAt = data.generatedAt.toLocaleDateString('ko-KR');

  // 프로젝트 목록: tasksByProject에서 가져옴 (실제 데이터 기반)
  const projectList = Object.keys(data.po.tasksByProject);
  const projectTabs = ['전체', ...projectList]
    .map((p, i) => `<div class="project-tab${i === 0 ? ' active' : ''}" data-project="${p}">${p}</div>`)
    .join('\n                ');

  const taskChangeClass = data.po.weeklyComparison.tasks.change >= 0 ? 'up' : 'down';
  const taskChangeSymbol = data.po.weeklyComparison.tasks.change >= 0 ? '▲' : '▼';
  const rateChangeClass = data.po.weeklyComparison.completionRate.change >= 0 ? 'up' : 'down';
  const rateChangeSymbol = data.po.weeklyComparison.completionRate.change >= 0 ? '▲' : '▼';

  const projectProgressBars = Object.entries(data.po.tasksByProject)
    .map(([name, stats]) => {
      const rate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
      return `
                        <div class="progress-item">
                            <div class="progress-header">
                                <span class="progress-label">${name}</span>
                                <span class="progress-value">${rate}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${rate}%;"></div>
                            </div>
                        </div>`;
    })
    .join('\n');

  const epicCards = data.po.epics
    .slice(0, 5)
    .map((epic) => {
      return `
                <div class="epic-card">
                    <div class="epic-header">
                        <span class="epic-title">[${epic.project || '전체'}] ${epic.content.title}</span>
                        <span class="status-badge status-${epic.status === '진행중' ? 'progress' : epic.status === '완료' ? 'done' : 'backlog'}">${epic.status}</span>
                    </div>
                    <div class="epic-meta">
                        <span>📅 생성: ${new Date(epic.content.createdAt).toLocaleDateString('ko-KR')}</span>
                        <span>👤 담당: ${epic.content.assignees?.[0]?.login || '미할당'}</span>
                    </div>
                </div>`;
    })
    .join('\n');

  const priorityStats = `
                        <div style="text-align: center;">
                            <span class="priority-badge priority-critical">P0</span>
                            <div style="font-size: 1.8rem; font-weight: 700; margin-top: 10px; color: #c53030;">${data.po.priorityDistribution['P0(긴급)'] || 0}</div>
                        </div>
                        <div style="text-align: center;">
                            <span class="priority-badge priority-high">P1</span>
                            <div style="font-size: 1.8rem; font-weight: 700; margin-top: 10px; color: #ed8936;">${data.po.priorityDistribution['P1(높음)'] || 0}</div>
                        </div>
                        <div style="text-align: center;">
                            <span class="priority-badge priority-medium">P2</span>
                            <div style="font-size: 1.8rem; font-weight: 700; margin-top: 10px; color: #d69e2e;">${data.po.priorityDistribution['P2(보통)'] || 0}</div>
                        </div>
                        <div style="text-align: center;">
                            <span class="priority-badge priority-low">P3</span>
                            <div style="font-size: 1.8rem; font-weight: 700; margin-top: 10px; color: #48bb78;">${data.po.priorityDistribution['P3(낮음)'] || 0}</div>
                        </div>`;

  const criticalIssueRows = data.po.criticalIssues
    .slice(0, 10)
    .map(
      (issue) => `
                    <tr>
                        <td>#${issue.content.number}</td>
                        <td>${issue.content.title}</td>
                        <td>${issue.project || '전체'}</td>
                        <td><span class="priority-badge priority-${issue.priority === 'P0(긴급)' ? 'critical' : 'high'}">${issue.priority}</span></td>
                        <td>${issue.content.assignees?.[0]?.login || '미할당'}</td>
                        <td><span class="status-badge status-${issue.status === '진행중' ? 'progress' : 'backlog'}">${issue.status}</span></td>
                    </tr>`
    )
    .join('\n');

  // 버그 리포트 행 생성
  const bugReportRows = data.ops.criticalBugs
    .slice(0, 10)
    .map(
      (bug) => `
                    <tr>
                        <td>#${bug.content.number}</td>
                        <td>${bug.content.title}</td>
                        <td>${bug.project || '전체'}</td>
                        <td><span class="priority-badge priority-${bug.priority === 'P0(긴급)' ? 'critical' : bug.priority === 'P1(높음)' ? 'high' : 'medium'}">${bug.priority}</span></td>
                        <td>${bug.content.assignees?.[0]?.login || '미할당'}</td>
                        <td><span class="status-badge status-${bug.status === '진행중' || bug.status === '작업중' ? 'progress' : 'backlog'}">${bug.status}</span></td>
                    </tr>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PO 주간 리포트 - ${periodStr}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 40px 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .report-header, .section { background: white; border-radius: 20px; padding: 30px; margin-bottom: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .report-header h1 { font-size: 2.5rem; color: #2d3748; margin-bottom: 10px; }
        .report-meta { display: flex; gap: 30px; color: #718096; flex-wrap: wrap; }
        .section-title { font-size: 1.5rem; color: #2d3748; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 3px solid #667eea; }
        .project-tabs { display: flex; gap: 10px; margin-bottom: 25px; flex-wrap: wrap; }
        .project-tab { padding: 12px 24px; background: #f7fafc; border: 2px solid #e2e8f0; border-radius: 10px; cursor: pointer; font-weight: 600; }
        .project-tab.active { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-color: transparent; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 15px; padding: 25px; text-align: center; }
        .stat-value { font-size: 2.5rem; font-weight: 700; color: #2d3748; }
        .stat-value.positive { color: #38a169; }
        .stat-label { color: #718096; }
        .stat-change { font-size: 0.85rem; margin-top: 8px; padding: 4px 10px; border-radius: 20px; display: inline-block; }
        .stat-change.up { background: #c6f6d5; color: #22543d; }
        .stat-change.down { background: #fed7d7; color: #742a2a; }
        .progress-item { margin-bottom: 20px; }
        .progress-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .progress-label { font-weight: 600; color: #2d3748; }
        .progress-value { color: #667eea; font-weight: 700; }
        .progress-bar { height: 12px; background: #e2e8f0; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); border-radius: 10px; }
        .epic-card { background: #f7fafc; border-radius: 12px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #667eea; }
        .epic-header { display: flex; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 10px; }
        .epic-title { font-weight: 600; color: #2d3748; }
        .epic-meta { display: flex; gap: 20px; color: #718096; font-size: 0.9rem; flex-wrap: wrap; }
        .status-badge { padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
        .status-progress { background: #bee3f8; color: #2b6cb0; }
        .status-done { background: #c6f6d5; color: #22543d; }
        .status-backlog { background: #e2e8f0; color: #4a5568; }
        .priority-badge { padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; }
        .priority-critical { background: #c53030; color: white; }
        .priority-high { background: #ed8936; color: white; }
        .priority-medium { background: #ecc94b; color: #744210; }
        .priority-low { background: #48bb78; color: white; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th, .data-table td { padding: 15px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .data-table th { background: #f7fafc; font-weight: 600; color: #4a5568; }
        footer { text-align: center; color: white; padding: 30px; opacity: 0.9; }
        @media (max-width: 768px) {
            .report-header h1 { font-size: 1.8rem; }
            .stats-grid { grid-template-columns: 1fr 1fr; }
            .data-table { font-size: 0.85rem; }
            .data-table th, .data-table td { padding: 10px 8px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="report-header">
            <h1>PO 주간 리포트</h1>
            <div class="report-meta">
                <span>📅 리포트 기간: ${periodStr}</span>
                <span>👤 작성자: SEMO</span>
                <span>📄 생성일: ${generatedAt}</span>
            </div>
        </header>

        <div class="section">
            <div class="project-tabs">
                ${projectTabs}
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${data.po.totalTasks}</div>
                    <div class="stat-label">전체 태스크</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value positive">${data.po.completionRate}%</div>
                    <div class="stat-label">완료율</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${data.po.inProgressTasks}</div>
                    <div class="stat-label">진행 중</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: #d69e2e;">${data.po.blockedTasks}</div>
                    <div class="stat-label">블로커</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">📊 프로젝트별 진행 현황</h2>
            ${projectProgressBars || '<p style="color: #718096;">프로젝트 데이터가 없습니다.</p>'}
        </div>

        <div class="section">
            <h2 class="section-title">📋 진행 중인 Epic</h2>
            ${epicCards || '<p style="color: #718096;">진행 중인 Epic이 없습니다.</p>'}
        </div>

        <div class="section">
            <h2 class="section-title">🐛 버그 리포트</h2>
            <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 20px;">
                <div class="stat-card">
                    <div class="stat-value" style="color: #e53e3e;">${data.ops.openBugs}</div>
                    <div class="stat-label">미해결 버그</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: #38a169;">${data.ops.resolvedBugs}</div>
                    <div class="stat-label">이번 주 해결</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${data.ops.newBugs}</div>
                    <div class="stat-label">이번 주 신규</div>
                </div>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>버그</th>
                        <th>프로젝트</th>
                        <th>우선순위</th>
                        <th>담당자</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    ${bugReportRows || '<tr><td colspan="6" style="color: #718096;">버그가 없습니다.</td></tr>'}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2 class="section-title">🚨 우선순위별 이슈 현황</h2>
            <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr);">
                ${priorityStats}
            </div>

            <h3 style="margin: 30px 0 20px; color: #2d3748;">P0/P1 이슈 목록</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>이슈</th>
                        <th>프로젝트</th>
                        <th>우선순위</th>
                        <th>담당자</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    ${criticalIssueRows || '<tr><td colspan="6" style="color: #718096;">P0/P1 이슈가 없습니다.</td></tr>'}
                </tbody>
            </table>
        </div>

        <footer>
            <p>Generated by SEMO | Semicolon DevTeam</p>
        </footer>
    </div>

    <script>
        // 프로젝트별 데이터
        const projectData = ${JSON.stringify(data.po.tasksByProject)};
        const allStats = {
            total: ${data.po.totalTasks},
            completed: ${data.po.completedTasks},
            inProgress: ${data.po.inProgressTasks},
            blocked: ${data.po.blockedTasks},
            rate: ${data.po.completionRate}
        };

        // 탭 클릭 이벤트
        document.querySelectorAll('.project-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                // 활성 탭 변경
                document.querySelectorAll('.project-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                const project = this.dataset.project;
                const statCards = document.querySelectorAll('.stat-card .stat-value');

                if (project === '전체') {
                    statCards[0].textContent = allStats.total;
                    statCards[1].textContent = allStats.rate + '%';
                    statCards[2].textContent = allStats.inProgress;
                    statCards[3].textContent = allStats.blocked;
                } else if (projectData[project]) {
                    const p = projectData[project];
                    const rate = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
                    statCards[0].textContent = p.total;
                    statCards[1].textContent = rate + '%';
                    statCards[2].textContent = '-';
                    statCards[3].textContent = '-';
                }
            });
        });
    </script>
</body>
</html>`;
}

function generateOpsReport(data: ReportData): string {
  const periodStr = `${data.period.start.toLocaleDateString('ko-KR')} ~ ${data.period.end.toLocaleDateString('ko-KR')}`;
  const generatedAt = data.generatedAt.toLocaleDateString('ko-KR');

  // 프로젝트 목록: tasksByProject에서 가져옴 (실제 데이터 기반)
  const projectList = Object.keys(data.po.tasksByProject);
  const projectTabs = ['전체', ...projectList]
    .map((p, i) => `<div class="project-tab${i === 0 ? ' active' : ''}" data-project="${p}">${p}</div>`)
    .join('\n                ');

  const alertBoxes = data.ops.alerts
    .slice(0, 5)
    .map(
      (alert) => `
            <div class="alert-box ${alert.type}">
                <span class="alert-icon">${alert.type === 'critical' ? '🔴' : alert.type === 'warning' ? '🟡' : '🔵'}</span>
                <div class="alert-content">
                    <div class="alert-title">${alert.title}</div>
                    <div>${alert.description}</div>
                </div>
            </div>`
    )
    .join('\n');

  const bugRows = data.ops.criticalBugs
    .slice(0, 10)
    .map(
      (bug) => `
                    <tr>
                        <td>#${bug.content.number}</td>
                        <td>${bug.content.title}</td>
                        <td>${bug.project || '전체'}</td>
                        <td><span class="severity-badge severity-${bug.priority === 'P0(긴급)' ? 'critical' : 'major'}">${bug.priority === 'P0(긴급)' ? 'Critical' : 'Major'}</span></td>
                        <td>${bug.content.assignees?.[0]?.login || '미할당'}</td>
                        <td><span class="status-badge status-${bug.status === '진행중' ? 'progress' : 'open'}">${bug.status}</span></td>
                        <td>${new Date(bug.content.createdAt).toLocaleDateString('ko-KR')}</td>
                    </tr>`
    )
    .join('\n');

  const feedbackCards = data.ops.feedbacks
    .slice(0, 5)
    .map((f) => {
      const labels = f.content.labels?.map((l: any) => l.name.toLowerCase()) || [];
      let category = 'question';
      if (labels.includes('bug')) category = 'bug';
      else if (labels.includes('feature') || labels.includes('enhancement')) category = 'feature';
      else if (labels.includes('improvement')) category = 'improvement';

      return `
            <div class="feedback-card">
                <div class="feedback-header">
                    <span class="feedback-category category-${category}">${category}</span>
                </div>
                <div class="feedback-content">"${(f.content.body || f.content.title)?.substring(0, 200)}..."</div>
                <div class="feedback-meta">
                    <span>📅 ${new Date(f.content.createdAt).toLocaleDateString('ko-KR')}</span>
                    <span>📁 ${f.project}</span>
                </div>
            </div>`;
    })
    .join('\n');

  const deploymentRows = data.ops.deployments
    .slice(0, 10)
    .map(
      (d) => `
                    <tr>
                        <td>${new Date(d.date).toLocaleString('ko-KR')}</td>
                        <td>${d.project}</td>
                        <td><span class="env-badge env-${d.env}">${d.env.toUpperCase()}</span></td>
                        <td>${d.version}</td>
                        <td>${d.author}</td>
                        <td><span class="status-badge status-resolved">성공</span></td>
                    </tr>`
    )
    .join('\n');

  const maxBugs = Math.max(...data.ops.weeklyBugTrend, 1);
  const bugTrendBars = data.ops.weeklyBugTrend
    .map((count, i) => {
      const height = Math.max(20, (count / maxBugs) * 100);
      const isLast = i === data.ops.weeklyBugTrend.length - 1;
      const color = isLast
        ? 'linear-gradient(180deg, #ed8936, #c53030)'
        : 'linear-gradient(180deg, #38ef7d, #11998e)';
      return `<div style="width: 40px; background: ${color}; height: ${height}%; border-radius: 5px 5px 0 0; text-align: center; color: white; font-size: 0.8rem; padding-top: 5px;">${count}</div>`;
    })
    .join('\n                            ');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>운영자 주간 리포트 - ${periodStr}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); min-height: 100vh; padding: 40px 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .report-header, .section { background: white; border-radius: 20px; padding: 30px; margin-bottom: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .report-header h1 { font-size: 2.5rem; color: #2d3748; margin-bottom: 10px; }
        .report-meta { display: flex; gap: 30px; color: #718096; flex-wrap: wrap; }
        .section-title { font-size: 1.5rem; color: #2d3748; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 3px solid #11998e; }
        .project-tabs { display: flex; gap: 10px; margin-bottom: 25px; flex-wrap: wrap; }
        .project-tab { padding: 12px 24px; background: #f7fafc; border: 2px solid #e2e8f0; border-radius: 10px; cursor: pointer; font-weight: 600; }
        .project-tab.active { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; border-color: transparent; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 15px; padding: 25px; text-align: center; }
        .stat-value { font-size: 2.5rem; font-weight: 700; color: #2d3748; }
        .stat-value.positive { color: #38a169; }
        .stat-value.negative { color: #e53e3e; }
        .stat-label { color: #718096; }
        .alert-box { padding: 20px; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: flex-start; gap: 15px; }
        .alert-box.critical { background: #fff5f5; border: 1px solid #fed7d7; }
        .alert-box.warning { background: #fffff0; border: 1px solid #faf089; }
        .alert-icon { font-size: 1.5rem; }
        .alert-content { flex: 1; }
        .alert-title { font-weight: 600; margin-bottom: 5px; }
        .alert-box.critical .alert-title { color: #c53030; }
        .alert-box.warning .alert-title { color: #975a16; }
        .severity-badge { padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; }
        .severity-critical { background: #c53030; color: white; }
        .severity-major { background: #ed8936; color: white; }
        .env-badge { padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; }
        .env-prd { background: #c53030; color: white; }
        .env-stg { background: #d69e2e; color: white; }
        .env-dev { background: #3182ce; color: white; }
        .status-badge { padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
        .status-progress { background: #bee3f8; color: #2b6cb0; }
        .status-resolved { background: #c6f6d5; color: #22543d; }
        .status-open { background: #fed7d7; color: #c53030; }
        .feedback-card { background: #f7fafc; border-radius: 12px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #11998e; }
        .feedback-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .feedback-category { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
        .category-bug { background: #fed7d7; color: #c53030; }
        .category-feature { background: #c6f6d5; color: #22543d; }
        .category-improvement { background: #bee3f8; color: #2b6cb0; }
        .category-question { background: #faf089; color: #975a16; }
        .feedback-content { color: #4a5568; line-height: 1.6; margin-bottom: 10px; }
        .feedback-meta { display: flex; gap: 20px; color: #718096; font-size: 0.85rem; flex-wrap: wrap; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th, .data-table td { padding: 15px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .data-table th { background: #f7fafc; font-weight: 600; color: #4a5568; }
        footer { text-align: center; color: white; padding: 30px; opacity: 0.9; }
        @media (max-width: 768px) {
            .report-header h1 { font-size: 1.8rem; }
            .stats-grid { grid-template-columns: 1fr 1fr; }
            .data-table { font-size: 0.85rem; }
            .data-table th, .data-table td { padding: 10px 8px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="report-header">
            <h1>운영자 주간 리포트</h1>
            <div class="report-meta">
                <span>📅 리포트 기간: ${periodStr}</span>
                <span>👤 작성자: SEMO</span>
                <span>📄 생성일: ${generatedAt}</span>
            </div>
        </header>

        <div class="section">
            <div class="project-tabs">
                ${projectTabs}
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${data.ops.newBugs}</div>
                    <div class="stat-label">신규 버그</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value positive">${data.ops.resolvedBugs}</div>
                    <div class="stat-label">해결된 버그</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${data.ops.deployments.length}</div>
                    <div class="stat-label">배포 횟수</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" style="color: #d69e2e;">${data.ops.feedbacks.length}</div>
                    <div class="stat-label">피드백 수신</div>
                </div>
            </div>
        </div>

        ${
          data.ops.alerts.length > 0
            ? `
        <div class="section">
            <h2 class="section-title">🚨 긴급 알림</h2>
            ${alertBoxes}
        </div>
        `
            : ''
        }

        <div class="section">
            <h2 class="section-title">🐛 버그 현황</h2>

            <div style="display: flex; gap: 25px; margin-bottom: 30px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 280px; background: #f7fafc; border-radius: 15px; padding: 25px;">
                    <div style="font-weight: 600; margin-bottom: 20px;">주간 버그 추이</div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; height: 100px; padding: 0 10px;">
                        ${bugTrendBars}
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 10px; font-size: 0.8rem; color: #718096;">
                        <span>4주전</span><span>3주전</span><span>2주전</span><span>1주전</span><span>이번주</span>
                    </div>
                </div>
            </div>

            <h3 style="margin: 30px 0 20px; color: #2d3748;">Critical/Major 버그 목록</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>제목</th>
                        <th>프로젝트</th>
                        <th>심각도</th>
                        <th>담당자</th>
                        <th>상태</th>
                        <th>발생일</th>
                    </tr>
                </thead>
                <tbody>
                    ${bugRows || '<tr><td colspan="7" style="color: #718096;">Critical/Major 버그가 없습니다.</td></tr>'}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2 class="section-title">💬 피드백 현황</h2>

            <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 30px;">
                <div class="stat-card">
                    <div class="stat-value negative">${data.ops.feedbacksByCategory.bug}</div>
                    <div class="stat-label">버그 리포트</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${data.ops.feedbacksByCategory.feature}</div>
                    <div class="stat-label">기능 요청</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value positive">${data.ops.feedbacksByCategory.improvement}</div>
                    <div class="stat-label">개선 제안</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${data.ops.feedbacksByCategory.question}</div>
                    <div class="stat-label">문의</div>
                </div>
            </div>

            <h3 style="margin: 20px 0;">최근 피드백</h3>
            ${feedbackCards || '<p style="color: #718096;">최근 피드백이 없습니다.</p>'}
        </div>

        <div class="section">
            <h2 class="section-title">🚀 배포 이력</h2>

            <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 30px;">
                <div style="text-align: center;">
                    <span class="env-badge env-prd">PRD</span>
                    <div style="font-size: 2rem; font-weight: 700; margin-top: 10px; color: #c53030;">${data.ops.deploymentsByEnv.prd || 0}</div>
                </div>
                <div style="text-align: center;">
                    <span class="env-badge env-stg">STG</span>
                    <div style="font-size: 2rem; font-weight: 700; margin-top: 10px; color: #d69e2e;">${data.ops.deploymentsByEnv.stg || 0}</div>
                </div>
                <div style="text-align: center;">
                    <span class="env-badge env-dev">DEV</span>
                    <div style="font-size: 2rem; font-weight: 700; margin-top: 10px; color: #3182ce;">${data.ops.deploymentsByEnv.dev || 0}</div>
                </div>
            </div>

            <h3 style="margin: 30px 0 20px; color: #2d3748;">배포 상세</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>일시</th>
                        <th>프로젝트</th>
                        <th>환경</th>
                        <th>버전</th>
                        <th>배포자</th>
                        <th>결과</th>
                    </tr>
                </thead>
                <tbody>
                    ${deploymentRows || '<tr><td colspan="6" style="color: #718096;">배포 이력이 없습니다.</td></tr>'}
                </tbody>
            </table>
        </div>

        <footer>
            <p>Generated by SEMO | Semicolon DevTeam</p>
        </footer>
    </div>
</body>
</html>`;
}

// ============================================
// 메인 실행
// ============================================

async function main() {
  console.log('[SEMO] 주간 리포트 생성 시작...\n');

  // 기간 설정 (이번 주 월요일 ~ 일요일)
  const now = new Date();
  const dayOfWeek = now.getDay();

  // 이번 주 월요일 계산 (일요일이면 6일 전, 아니면 dayOfWeek-1일 전)
  const startDate = new Date(now);
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startDate.setDate(now.getDate() - daysToMonday);
  startDate.setHours(0, 0, 0, 0);

  // 이번 주 일요일 계산 (월요일 + 6일)
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  console.log(`리포트 기간: ${startDate.toLocaleDateString('ko-KR')} ~ ${endDate.toLocaleDateString('ko-KR')}\n`);

  // GitHub 데이터 조회
  console.log('GitHub 데이터 조회 중...');

  const projectItems = fetchProjectItems();
  console.log(`- Project Items: ${projectItems.length}개`);

  const orgIssues = fetchOrgIssues('all');
  console.log(`- Org Issues: ${orgIssues.length}개`);

  const bugIssues = fetchOrgIssues('all', 'bug');
  console.log(`- Bug Issues: ${bugIssues.length}개`);

  const feedbackIssues = fetchOrgIssues('open', 'feedback');
  console.log(`- Feedback Issues: ${feedbackIssues.length}개`);

  const deployments = fetchRecentDeployments();
  console.log(`- Deployments: ${deployments.length}개\n`);

  // 데이터 집계
  const reportData = aggregateReportData(
    projectItems,
    orgIssues,
    bugIssues,
    feedbackIssues,
    deployments,
    { start: startDate, end: endDate }
  );

  // HTML 생성
  console.log('리포트 생성 중...');
  const poReportHtml = generatePOReport(reportData);
  const opsReportHtml = generateOpsReport(reportData);

  // 파일명에 날짜 포함
  const dateStr = endDate.toISOString().split('T')[0];
  const poFileName = `po-weekly-report-${dateStr}.html`;
  const opsFileName = `ops-weekly-report-${dateStr}.html`;

  // 파일 저장
  fs.writeFileSync(path.join(config.outputDir, poFileName), poReportHtml, 'utf-8');
  fs.writeFileSync(path.join(config.outputDir, opsFileName), opsReportHtml, 'utf-8');

  // 최신 버전도 저장 (고정 파일명)
  fs.writeFileSync(path.join(config.outputDir, 'po-weekly-report.html'), poReportHtml, 'utf-8');
  fs.writeFileSync(path.join(config.outputDir, 'ops-weekly-report.html'), opsReportHtml, 'utf-8');

  console.log(`\n✅ 리포트 생성 완료!`);
  console.log(`- PO 리포트: ${poFileName}`);
  console.log(`- 운영자 리포트: ${opsFileName}`);
}

main().catch(console.error);
