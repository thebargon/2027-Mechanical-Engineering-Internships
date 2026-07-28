export interface Job {
  companyName: string;
  companyUrl: string | null;
  title: string;
  location: string | null;
  url: string;
  source: string;
  postedAt: string | null;
  ageDays: number | null;
  category: string;
  score: number;
}
