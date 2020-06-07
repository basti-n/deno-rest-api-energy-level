import { EnergyLevel } from '../defs/energy-level.model.ts';
import { Response } from '../defs/response.model.ts';
import { getRandomEnergyLevel } from './utils/get-random-energy-value.ts';
import { getDateFromToday } from './utils/get-date-from-today.ts';
import { isSameDay } from './utils/is-same-day.ts';

const energyLevels: EnergyLevel[] = [
  { value: 100, date: new Date() },
  { value: getRandomEnergyLevel(), date: getDateFromToday(-1) },
  { value: getRandomEnergyLevel(), date: getDateFromToday(-2) },
  { value: getRandomEnergyLevel(), date: getDateFromToday(-3) },
  { value: getRandomEnergyLevel(), date: getDateFromToday(-4) },
  { value: getRandomEnergyLevel(), date: getDateFromToday(-5) },
  { value: getRandomEnergyLevel(), date: getDateFromToday(-6) },
];

let energyMock: { [userId: string]: EnergyLevel[] } = {
  miriam: energyLevels,
  123: energyLevels,
};

// @route api/v1/energy:id
// @request GET energy by user

export const getEnergy = ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  let result: Response<EnergyLevel[]>;
  if (!params.id) {
    result = {
      result: [],
      success: false,
      invalidProperties: 'No user provided',
    };
    response.status = 400;
  } else {
    const energy = energyMock[params.id];

    result = {
      result: energy || [],
      success: true,
    };
    response.status = 200;
  }
  response.body = result;
};

// @route api/v1/energy:id
// @request Update energy

export const patchEnergy = async ({
  request,
  params,
  response,
}: {
  request: any;
  params: { id: string };
  response: any;
}) => {
  let result: Response<boolean>;
  if (!params.id) {
    result = {
      result: false,
      success: false,
      invalidProperties: 'No user provided',
    };
    response.status = 400;
  } else {
    const body = await request.body();

    if (!request.hasBody) {
      result = {
        result: false,
        success: false,
        invalidProperties: 'No energy data provided',
      };
      response.status = 400;
      return;
    }

    if (!energyMock[params.id]) {
      energyMock = { ...energyMock, [params.id]: [body] };
    } else {
      energyMock = {
        ...energyMock,
        [params.id]: [
          ...energyMock[params.id].filter(
            (entry) => !isSameDay(entry.date, body?.value?.date)
          ),
          { value: Number(body?.value?.value), date: body?.value?.date },
        ],
      };
    }

    result = {
      result: true,
      success: true,
    };

    response.status = 200;
    response.body = result;
  }
};
