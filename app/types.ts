export interface SkillItem {
  id: string;
  name: string;
  category: 'Languages' | 'Tools' | 'Frameworks' | 'Core Skills';
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  type: 'work' | 'education';
}

export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  careerGoal: string;
  avatarUrl: string;
  email?: string;
  github?: string;
  linkedin?: string;
  skills: SkillItem[];
  experiences: ExperienceItem[];
}

export interface ProjectData {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  img: string;
  demoUrl?: string;
  githubUrl?: string;
  embedUrl?: string; // Iframe live interactive preview
  featured?: boolean;
}

export interface KpiItem {
  id: string;
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: 'dollar' | 'users' | 'activity' | 'chart' | 'trending';
}

export interface ChartSeries {
  dataKey: string;
  name: string;
  color: string;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: 'area' | 'bar' | 'line' | 'pie';
  description?: string;
  xAxisKey: string;
  series: ChartSeries[];
  data: Record<string, any>[];
}

export interface DashboardData {
  title: string;
  description: string;
  kpis: KpiItem[];
  charts: ChartConfig[];
  tableData?: Record<string, any>[];
}
