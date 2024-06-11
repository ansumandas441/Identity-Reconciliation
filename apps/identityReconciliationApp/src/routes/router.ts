import { Router } from 'express';
import { controller } from '../controllers/controller';
import validateIdentifySchema from '../middlewares/routeMiddleware';

const router = Router();

// router.post('/add', cartMiddleWares.validateAddProduct, controller.addToCart);
router.post('/identify', validateIdentifySchema, controller.add);
router.get('/getAll', controller.getAll);
router.delete('/clear', controller.deleteDatabase);

export default router;