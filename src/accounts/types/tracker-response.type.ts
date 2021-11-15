export interface Slp {
  total: number;
  claimableTotal: number;
  lastClaimedItemAt: number;
}

export interface Daily {
  slp: Slp;
  date: string;
}

export interface TrackerDailyResponse {
  daily: Daily[];
}
