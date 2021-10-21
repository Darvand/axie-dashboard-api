export interface Fighter {
  team_id: string;
  fighter_id: number;
  fighter_class: string;
  fighter_level: number;
}

export interface BattleLog {
  id: string;
  first_client_id: string;
  first_team_id: string;
  second_client_id: string;
  second_team_id: string;
  winner: number;
  created_at: Date;
  battle_uuid: string;
  battle_type: number;
  fighters: Fighter[];
  replay: string;
}

export type BattleLogs = {
  pve: BattleLog[];
};

export interface PveFightsResponse {
  success: boolean;
  address: string;
  battle_logs: BattleLogs;
  cache: {
    status: true;
    message: 'Daddy chill~';
    cache_ttl: '2 hours, 25 minutes & 48 seconds';
  };
}

export interface PvpFightsResponse {
  sucess: boolean;
  items: BattleLog[];
}
