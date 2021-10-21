export interface SLPResponse {
  success: boolean;
  cache_last_updated: number;
  draw_total: number;
  lose_total: number;
  win_total: number;
  total_matches: number;
  win_rate: number;
  mmr: number;
  rank: number;
  ronin_slp: number;
  total_slp: number;
  in_game_slp: number;
  last_claim: number;
  lifetime_slp: number;
  name: string;
  next_claim: number;
}
