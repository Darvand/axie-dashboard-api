export interface Item {
  client_id: string;
  win_total: number;
  draw_total: number;
  lose_total: number;
  elo: number;
  rank: number;
  name: string;
}

export interface MMRResponse {
  success: boolean;
  items: Item[];
  offset: number;
  limit: number;
  update_time: number;
}
