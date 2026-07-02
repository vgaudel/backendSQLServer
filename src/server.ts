import app from './app';
import { db } from './config/database';

const PORT = process.env.PORT || 3003;

// Démarrer le serveur
const server = app.listen(PORT, () => {
	console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
	console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Gestion de l'arrêt gracieux
async function shutdown(signal: string): Promise<void> {
	console.log(`\n⚠️  ${signal} reçu, fermeture du serveur...`);
	server.close(async () => {
		await db.close();
		console.log('👋 Serveur arrêté proprement');
		process.exit(0);
	});
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default server;
