



import { BaseEntity } from "./common";

export interface Result extends BaseEntity {
  score: number;

  totalQuestions: number;

  percentage: number;

  position: number;
}