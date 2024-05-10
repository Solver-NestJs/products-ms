import 'dotenv/config';
import * as joi from 'joi';

interface EnvConfig {
  PORT: number;
  DATABASE_URL: string;
  NATS_SERVERS: string[];
}

const envVarsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true); //Permite que el objeto tenga claves desconocidas que se ignoraran

const { error, value } = envVarsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS.split(','),
});

//console.log(process.env);
if (error) {
  throw new Error(`Error en el archivo de configuacion .env: ${error.message}`);
}

const envVars: EnvConfig = value;

export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
  natsServers: envVars.NATS_SERVERS,
};
