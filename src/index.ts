import { client } from './discord/bot';
import { createRestApi } from './api';

const PORT = process.env.PORT || 3000;

const api = createRestApi(client);

api.listen(PORT, () => {
  console.log('API is active 🤖');
});
