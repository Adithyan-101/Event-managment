import express from 'express';
import { getRegistrations, createRegistration } from '../controllers/registrationController.js';

const router = express.Router();

router.get('/', getRegistrations);
router.post('/', createRegistration);

export default router;
