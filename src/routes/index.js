import { Router } from 'express';
import { encryptSession } from '../controller/encryptController';
import * as MessageController from '../controller/messageController';
import * as DeviceController from '../controller/deviceController';
import * as SessionController from '../controller/sessionController';
import userController, * as UserController from '../controller/userController';
import verifyToken from '../middleware/auth';
import statusConnection from '../middleware/statusConnection';
import multer from 'multer';
import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);
const routes = new Router();

//Users
routes.post('/api/users', userController.store);

// Sessions
routes.post('/api/generate-token', encryptSession);
routes.get('/api/:secretkey/show-all-sessions', SessionController.showAllSessions);
routes.post('/api/:secretkey/start-all', SessionController.startAllSessions);
routes.get('/api/:session/status-session', verifyToken, SessionController.getSessionState);
routes.get('/api/:session/check-connection-session', verifyToken, SessionController.checkConnectionSession);
routes.post('/api/:session/start-session', verifyToken, SessionController.startSession);
routes.post('/api/:session/logout-session', verifyToken, statusConnection, SessionController.logOutSession);
routes.post('/api/:session/restart-service', verifyToken, statusConnection, SessionController.restartService);

// Senders
routes.post('/api/:session/send-message', verifyToken, statusConnection, MessageController.sendMessage);
routes.post(
  '/api/:session/send-image',
  upload.single('file'),
  verifyToken,
  statusConnection,
  MessageController.sendImage
);
routes.post(
  '/api/:session/send-file',
  upload.single('file'),
  verifyToken,
  statusConnection,
  MessageController.sendFile
);
routes.post('/api/:session/send-file-base64', verifyToken, statusConnection, MessageController.sendFile64);

// Profile
routes.get('/api/:session/profile-pic/:phone', verifyToken, statusConnection, DeviceController.getProfilePicFromServer);

export default routes;
