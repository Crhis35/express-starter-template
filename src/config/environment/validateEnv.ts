import { cleanEnv, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    SERVER_CONFIG: str(),
  });
};

export default validateEnv;
