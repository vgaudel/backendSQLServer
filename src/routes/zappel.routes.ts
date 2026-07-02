import { Router } from 'express';
import { zappelController } from '../controllers/zappel.controller';

const router = Router();

// GET /api/zappel
router.get('/', (req, res, next) => zappelController.getAll(req, res, next));

// GET /api/zappel/stats/by-type
// Déclaré avant /:refAppel pour éviter la capture par la route paramétrée.
router.get('/stats/by-type', (req, res, next) => zappelController.getStatsByType(req, res, next));

// GET /api/zappel/:refAppel
router.get('/:refAppel', (req, res, next) => zappelController.getByRef(req, res, next));

export default router;
