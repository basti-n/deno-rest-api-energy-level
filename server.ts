import { Application } from 'https://deno.land/x/oak/mod.ts';
import routes from './routes.ts'

const port = 5000;

const app = new Application();

app.use(routes.allowedMethods());
app.use(routes.routes());

console.log(`Listening on port ${port}`);

await app.listen({ port });
