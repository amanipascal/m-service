
import { createClient } from 'redis';
const url = process.env.DF_URL
export const client = createClient()
client.on('error', (err) => console.log('Redis Client Error', err));
(async ()  => {
    await client.connect()
})()
