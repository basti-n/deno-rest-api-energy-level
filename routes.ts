import { Router } from 'https://deno.land/x/oak/mod.ts';
import { patchEnergy, getEnergy, getEnergyById } from './controllers/energy.ts';

const baseUrl = '/api/v1';
const routes = new Router();

routes.get(`${baseUrl}/energy/:user`, getEnergy);
routes.get(`${baseUrl}/energy/:user/:id`, getEnergyById);
routes.patch(`${baseUrl}/energy/:user`, patchEnergy);

export default routes;
