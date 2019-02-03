import express from 'express';
import httpAuthMiddleware from '../middlewares/httpAuthMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import * as roomController from '../controllers/roomController';

const router = express.Router();

router.use(httpAuthMiddleware);

router.get('/', roomController.getRoomsList);
router.get('/:id', roomController.getRoom);
router.get('/:id/messages', roomController.getHistory);
router.post('/', roomController.createRoom);
router.put('/:id', adminMiddleware, roomController.updateRoom);
router.delete('/:id', adminMiddleware, roomController.deleteRoom);
router.put('/:id/leave', roomController.leaveRoom);
router.put('/:id/add', adminMiddleware, roomController.addParticipant);

export default router;
