import { Router } from 'express';
import controller from '../controllers/controller';

const router = Router();

router.post('/add', cartMiddleWares.validateAddProduct, controller.addToCart);

