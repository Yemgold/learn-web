


import { BaseEntity } from "./common";

export interface Ranking extends BaseEntity {
  position: number;

  points: number;

  school: string;

  state: string;
}