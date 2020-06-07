import { Energy } from './energy.model.ts';

export interface EnergyLevel extends Energy {
  date: Date | string;
  comment?: string;
}
