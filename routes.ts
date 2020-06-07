import { Router } from 'https://deno.land/x/oak/mod.ts';
import { getEnergy, patchEnergy } from './controllers/energy.ts';

const baseUrl = '/api/v1';
const routes = new Router();

routes.get(`${baseUrl}/energy/:id`, getEnergy);

routes.patch(`${baseUrl}/energy/:id`, patchEnergy);

export default routes;
