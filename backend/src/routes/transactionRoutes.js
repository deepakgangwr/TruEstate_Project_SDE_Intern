import express from 'express';
import { getTransactions, getFilterOptions } from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', getTransactions);
router.get('/options', getFilterOptions);

export default router;

