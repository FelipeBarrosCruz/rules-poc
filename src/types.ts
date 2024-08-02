export enum SCORES {
  LOW = "LOW",
  AVG = "AVG",
  MAX = "MAX",
}

export type Rates = {
  min: number;
  avg: number;
  max: number;
};

export type EngineArgs = {
  rates?: Rates;
};

export type Consequence = {
  status: boolean;
  reason?: string;
  weight: number;
};

export type Rule = {
  name: string;
  order?: number;
  weight: number;
  condition: () => boolean | Promise<boolean>;
  consequence?: (args: Consequence) => Consequence | Promise<Consequence>;
};

export interface IEngineResult {
  getWeight(): number;
  getScore(): SCORES;
}
