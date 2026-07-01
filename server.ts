import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { db } from './database.service';
import zappelRoutes from './zappel.routes';

// Créer l'application Express
const app: Express = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(helmet()); // Sécurité
app.use(cors()); // CORS
app.use(express.json()); // Parser JSON
app.use(express.urlencoded({ extended: true })); // Parser URL-encoded

// Logger des requêtes
app.use((req: Request, res: Response, next: NextFunction) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
	next();
});

// Routes
app.get('/', (req: Request, res: Response) => {
	res.json({ 
		message: 'API mobilesql - Serveur actif',
		endpoints: {
			appels: '/api/zappel',
			appelById: '/api/zappel/:refAppel',
			stats: '/api/zappel/stats/by-type'
		}
	});
});

// Routes ZAPPEL
app.use('/api/zappel', zappelRoutes);

// Route de santé
app.get('/health', async (req: Request, res: Response) => {
	try {
		await db.getPool();
		res.json({ 
			status: 'healthy',
			database: 'connected',
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		res.status(503).json({ 
			status: 'unhealthy',
			database: 'disconnected',
			error: error instanceof Error ? error.message : 'Unknown error'
		});
	}
});

// Gestion des erreurs 404
app.use((req: Request, res: Response) => {
	res.status(404).json({ 
		success: false,
		message: 'Route non trouvée' 
	});
});

// Gestion globale des erreurs
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error('❌ Erreur:', err);
	res.status(500).json({ 
		success: false,
		message: 'Erreur interne du serveur',
		error: process.env.NODE_ENV === 'development' ? err.message : undefined
	});
});

// Démarrer le serveur
const server = app.listen(PORT, () => {
	console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
	console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', async () => {
	console.log('⚠️  SIGTERM reçu, fermeture du serveur...');
	server.close(async () => {
		await db.close();
		console.log('👋 Serveur arrêté proprement');
		process.exit(0);
	});
});

process.on('SIGINT', async () => {
	console.log('\n⚠️  SIGINT reçu, fermeture du serveur...');
	server.close(async () => {
		await db.close();
		console.log('👋 Serveur arrêté proprement');
		process.exit(0);
	});
});

export default app;
