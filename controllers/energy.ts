import { Client } from 'https://deno.land/x/postgres/mod.ts';
import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import { EnergyLevel } from '../defs/energy-level.model.ts';
import { Response } from '../defs/response.model.ts';
import { isSameDay } from './utils/is-same-day.ts';
import { dbCredentials } from '../db-config.ts';
import { hasDbEntries } from './utils/has-db-entries.ts';
import { formatDbResponse } from './utils/format-db-response.ts';

const client = new Client(dbCredentials);

// @route api/v1/energy/:user
// @request GET energy by user

export const getEnergy = async ({
  params,
  response,
}: {
  params: { user: string };
  response: any;
}) => {
  let result: Response<EnergyLevel[]>;
  if (!params.user) {
    result = {
      result: [],
      success: false,
      invalidProperties: 'No user provided',
    };
    response.status = 400;
  } else {
    try {
      await client.connect();

      const dbEntriesForUser = await client.query(
        `SELECT * from energylevels where username = $1`,
        params.user
      );

      if (!hasDbEntries(dbEntriesForUser)) {
        setNoResultFound(response);
        return;
      }

      const formattedResult = formatDbResponse<EnergyLevel>(dbEntriesForUser);
      result = {
        result: formattedResult,
        success: true,
      };
      response.body = result;
      response.status = 200;
    } catch (err) {
      setErrorResponse(response, err);
    } finally {
      client.end();
    }
  }
};

// @route api/v1/energy/:user/:id
// @request Get energy by id

export const getEnergyById = async ({
  params,
  response,
}: {
  params: { user: string; id: string };
  response: any;
}) => {
  if (!params.user) {
    setUsernameNotProvidedResponse(response);
    return;
  }
  if (!params.id) {
    setIdNotProvidedResponse(response);
    return;
  }

  try {
    await client.connect();

    const dbEntriesForUserAndId = await client.query(
      `SELECT * from energylevels where username = $1 and id = $2`,
      params.user,
      params.id
    );

    if (!hasDbEntries(dbEntriesForUserAndId)) {
      setNoResultFound(response);
      return;
    }

    const formattedResult = formatDbResponse(dbEntriesForUserAndId);

    const result = {
      result: formattedResult,
      success: true,
    };

    response.body = result;
    response.status = 200;
  } catch (err) {
    setErrorResponse(response, err);
  } finally {
    await client.end();
  }
};

// @route api/v1/energy:user
// @request Update energy

export const patchEnergy = async ({
  request,
  params,
  response,
}: {
  request: any;
  params: { user: string };
  response: any;
}) => {
  let result: Response<EnergyLevel[] | undefined>;

  if (!params.user) {
    result = {
      success: false,
      invalidProperties: 'No user (id) provided',
    };
    response.body = result;
    response.status = 400;
  } else {
    const body = await request.body();

    if (!request.hasBody) {
      setNoDataProvided(response);
      return;
    }

    try {
      await client.connect();
      const energy: EnergyLevel = body.value;
      const user = params.user;

      const dbEntriesForUser = await client.query(
        `SELECT * from energylevels where username = $1`,
        params.user
      );

      if (!hasDbEntries(dbEntriesForUser)) {
        const id = v4.generate();
        await client.query(
          'INSERT INTO energylevels(id,value,date,username) VALUES($1, $2, $3, $4)',
          id,
          energy.value,
          energy.date,
          user
        );

        const updateEnergyFromDb = await client.query(
          'SELECT * from energylevels WHERE id = $1 AND username = $2',
          id,
          params.user
        );

        result = {
          result: formatDbResponse<EnergyLevel>(updateEnergyFromDb),
          success: true,
        };

        response.status = 201;
        response.body = result;
      } else {
        const formattedResult = formatDbResponse<EnergyLevel>(dbEntriesForUser);
        const entryToUpdate = formattedResult.find((entry) =>
          isSameDay(entry.date, energy.date)
        );

        if (!entryToUpdate) {
          const id = v4.generate()
          await client.query(
            'INSERT INTO energylevels(id,value,date,username) VALUES($1, $2, $3, $4)',
            id,
            energy.value,
            energy.date,
            user
          );

          const updateEnergyFromDb = await client.query(
            'SELECT * from energylevels WHERE id = $1 AND username = $2',
            id,
            params.user
          );
  
          result = {
            result: formatDbResponse<EnergyLevel>(updateEnergyFromDb),
            success: true,
          };
  
          response.status = 201;
          response.body = result;

          return;
        }

        await client.query(
          'UPDATE energylevels SET value=$1, date=$2, username=$3 WHERE id=$4',
          energy.value,
          energy.date,
          params.user,
          entryToUpdate.id
        );

        result = {
          result: [entryToUpdate],
          success: true,
        };

        response.status = 200;
        response.body = result;
      }
    } catch (err) {
      setErrorResponse(response, err);
    } finally {
      await client.end();
    }
  }
};

function setErrorResponse(response: any, err: Error) {
  response.status = 500;
  response.body = {
    success: false,
    error: true,
    message: err && err.toString(),
  };
}

function setUsernameNotProvidedResponse(response: any) {
  const result = {
    result: [],
    success: false,
    invalidProperties: 'No user provided',
  };
  response.body = result;
  response.status = 400;
}

function setIdNotProvidedResponse(response: any) {
  const result = {
    result: [],
    success: false,
    invalidProperties: 'No id provided',
  };
  response.body = result;
  response.status = 400;
}

function setNoDataProvided(response: any) {
  const result = {
    success: false,
    invalidProperties: 'No energy data provided',
  };
  response.body = result;
  response.status = 400;
}

function setNoResultFound(response: any) {
  const result = {
    result: [],
    success: false,
  };
  response.body = result;
  response.status = 404;
}


