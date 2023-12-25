import {client} from '../client.js';
import { Schema, Repository } from 'redis-om';


/* create a Schema for Person */
const personSchema = new Schema('Person', {
    firstName: { type: 'string' },
    lastName: { type: 'string' }
  })

/* use the client to create a Repository just for Persons */
export let personRepository = new Repository(personSchema, client);
