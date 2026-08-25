



import { BaseEntity } from "./common";

export interface Question extends BaseEntity {
  subject: string;

  text: string;

  options: string[];

  answer: string;

  explanation?: string;

  difficulty:
    | "EASY"
    | "MEDIUM"
    | "HARD";
}