import express from 'express';
import { getEvents, createEvent, updateEventStatus } from '../controllers/eventController.js';

const router = express.Router();

router.get('/', getEvents);
router.post('/', createEvent);
router.patch('/:id/status', updateEventStatus);

export default router;
