import 'reflect-metadata';
import { defaultMetadataStorage as classTransformerDefaultMetadataStorage } from 'class-transformer/cjs/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import hpp from 'hpp';
import morgan from 'morgan';
import { useExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import errorMiddleware from '@/config/middlewares/error.middleware';
import { logger, stream } from '@/config/utils/logger';
import { dbOptions, DI } from '@/persistence/database-1/data-source';
import { User } from '@/persistence/database-1/entities';
import { MikroORM } from '@mikro-orm/postgresql';
import { RequestContext } from '@mikro-orm/core';
import { environment } from '@/config';
import { loadHelmet } from '@/shared/security/load-helmet';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(Controllers: Function[]) {
    this.app = express();
    this.env = environment.nodeEnv || 'development';
    this.port = environment.server.port || 3000;

    this.initializeMiddlewares();
    this.connectToDatabase();
    this.initializeRoutes(Controllers);
    //this.initializeSwagger(Controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`?? App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public close() {
    this.app.close(() => {
      process.exit(1);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(environment.logs.format, { stream }));
    this.app.use(hpp());
    this.app.use(loadHelmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(controllers: Function[]) {
    useExpressServer(this.app, {
      cors: {
        origin: environment.server.origin,
        credentials: environment.server.credentials,
      },
      controllers: controllers,
      defaultErrorHandler: false,
    });
  }

  private initializeSwagger(controllers: Function[]) {
    const schemas = validationMetadatasToSchemas({
      refPointerPrefix: '#/components/schemas/',
    });

    const routingControllersOptions = {
      controllers: controllers,
    };

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: {
        schemas,
        securitySchemes: {
          basicAuth: {
            scheme: 'basic',
            type: 'http',
          },
        },
      },
      info: {
        description: 'Generated with `routing-controllers-openapi`',
        title: 'A sample API',
        version: '1.0.0',
      },
    });

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
  private async connectToDatabase() {
    try {
      DI.orm = await MikroORM.init(dbOptions);
      DI.em = DI.orm.em.fork();
      DI.userRepository = DI.orm.em.fork().getRepository(User);
    } catch (error) {
      console.error(error);
      logger.error(error);
    }
    this.app.use((_1, _2, next) => RequestContext.create(DI.orm.em, next));
  }
}

export default App;
