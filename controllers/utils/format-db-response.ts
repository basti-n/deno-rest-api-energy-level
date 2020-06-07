import { QueryResult } from 'https://deno.land/x/postgres/query.ts';
import { hasDbEntries } from './has-db-entries.ts';

export function formatDbResponse<T>(queryResult: QueryResult): T[] {
  if (!!hasDbEntries(queryResult)) {
    let result: T[] = new Array();

    queryResult.rows.map((qResult) => {
      let obj: any = new Object();
      const descriptors = queryResult.rowDescription.columns;
      descriptors.map((column, index) => {
        const descriptor: string = column.name;
        obj[descriptor] = qResult[index];
      });

      result.push(obj);
    });

    return result;
  }

  return [] as T[];
}
