



import { BaseEntity } from "./common";

export interface Competition extends BaseEntity {
  title: string;

  description: string;

  startDate: string;

  endDate: string;

  registrationDeadline: string;

  status:
    | "UPCOMING"
    | "ACTIVE"
    | "COMPLETED";
}