import { QueryResult } from 'https://deno.land/x/postgres/query.ts';

export function hasDbEntries(queryResult: QueryResult): boolean {
  return !!queryResult.rows && !!queryResult.rows.length;
}
