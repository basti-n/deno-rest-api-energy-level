import { getRandomEnergyLevel } from '../controllers/utils/get-random-energy-value.ts';
import { EnergyLevel } from '../defs/energy-level.model.ts';
import { getDateFromToday } from '../controllers/utils/get-date-from-today.ts';

export const energyLevels: EnergyLevel[] = [
  { value: 100, date: new Date() },
  { value: getRandomEnergyLevel(), date: getDateFromToday(-1) },
  { value: getRandomEnergyLevel(), date: getDateFromToday(-2) },
  { value: getRandomEnergyLevel(), date: getDateFromToday(-3) },
  { value: getRandomEnergyLevel(), date: getDateFromToday(-4) },
  { value: getRandomEnergyLevel(), date: getDateFromToday(-5) },
  { value: getRandomEnergyLevel(), date: getDateFromToday(-6) },
];

export let energyMock: { [userId: string]: EnergyLevel[] } = {
  miriam: energyLevels,
  123: energyLevels,
};
