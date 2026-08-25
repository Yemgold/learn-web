



import { BaseEntity } from "./common";

export interface Notification extends BaseEntity {
  title: string;

  message: string;

  read: boolean;
}