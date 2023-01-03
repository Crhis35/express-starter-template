import App from '@application/api/app';
import { UsersController } from './users/users.controller';

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION Shuting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = new App([UsersController]);

app.listen();

process.on('unhandledRejection', err => {
  console.log('UUNHANDLER REJECTION Shuting down...');
  console.log(err.name, err.message);
  app.close();
});
