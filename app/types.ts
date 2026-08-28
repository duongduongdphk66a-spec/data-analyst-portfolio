export interface SkillItem {
  id: string;
  name: string;
  category: 'Languages' | 'Tools' | 'Frameworks' | 'Core Skills' | 'Languages & Querying' | 'BI & Visualization' | 'Statistical & Modeling' | 'Data Engineering';
  level?: number; // 1 to 5 stars
  icon?: string;
  proficiencyNote?: string;
  tags?: string[];
}

export interface CareerGoalItem {
  id: string;
  title: string;
  desc: string;
  icon?: 'list' | 'cloud' | 'network' | 'target' | 'database' | 'cpu';
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  type: 'work' | 'education';
  location?: string;
}

export interface ProfileData {
  name: string;
  subtitle?: string;
  title: string;
  bio: string;
  careerGoal: string;
  careerGoalsList?: CareerGoalItem[];
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
  content?: string; // Markdown content for detail page
  problem?: string;
  method?: string;
  insight?: string;
  metrics?: { label: string; value: string; change?: string; isPositive?: boolean }[];
  tools?: string[];
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

