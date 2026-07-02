import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { requestLogger } from './middlewares/logger.middleware';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware';

// Créer et configurer l'application Express
const app: Express = express();

// Middleware
app.use(helmet()); // Sécurité
app.use(cors()); // CORS
app.use(express.json()); // Parser JSON
app.use(express.urlencoded({ extended: true })); // Parser URL-encoded
app.use(requestLogger); // Logger des requêtes

// Routes de l'application
app.use('/', routes);

// Gestion des erreurs 404
app.use(notFoundHandler);

// Gestion globale des erreurs
app.use(errorHandler);

export default app;
