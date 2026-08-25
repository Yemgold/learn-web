



import { BaseEntity } from "./common";
import { User } from "./user";

export interface Team extends BaseEntity {
  name: string;

  code: string;

  members: User[];

  captain: User;

  school: string;

  state: string;
}