import { clientsArray } from '../util/sessionUtil';
import { callWebHook, contactToArray } from '../util/functions';
import CreateSessionUtil from '../util/createSessionUtil';
import getAllTokens from '../util/getAllTokens';

const SessionUtil = new CreateSessionUtil();

export async function startAllSessions(req, res) {
  const { secretkey } = req.params;
  const { authorization: token } = req.headers;

  let tokenDecrypt = '';

  if (secretkey === undefined) {
    tokenDecrypt = token.split(' ')[0];
  } else {
    tokenDecrypt = secretkey;
  }

  const allSessions = await getAllTokens(req);

  if (tokenDecrypt !== req.serverOptions.secretKey) {
    return res.status(400).json({
      response: 'error',
      message: 'The token is incorrect',
    });
  }

  allSessions.map(async (session) => {
    const util = new CreateSessionUtil();
    await util.opendata(req, session);
  });

  return await res.status(201).json({ status: 'success', message: 'Starting all sessions' });
}

export async function showAllSessions(req, res) {
  const { secretkey } = req.params;
  const { authorization: token } = req.headers;

  let tokenDecrypt = '';

  if (secretkey === undefined) {
    tokenDecrypt = token.split(' ')[0];
  } else {
    tokenDecrypt = secretkey;
  }

  const arr = [];

  if (tokenDecrypt !== req.serverOptions.secretKey) {
    return res.status(400).json({
      response: false,
      message: 'The token is incorrect',
    });
  }

  Object.keys(clientsArray).forEach((item) => {
    arr.push({ session: item });
  });

  return res.status(200).json({ response: arr });
}

export async function startSession(req, res) {
  const session = req.session;
  const { waitQrCode = false } = req.body;

  await getSessionState(req, res);
  await SessionUtil.opendata(req, session, waitQrCode ? res : null);
}

export async function logOutSession(req, res) {
  try {
    const session = req.session;
    await req.client.logout();

    req.io.emit('whatsapp-status', false);
    callWebHook(req.client, req, 'logoutsession', {
      message: `Session: ${session} logged out`,
      connected: false,
    });

    return await res.status(200).json({ status: true, message: 'Session successfully closed' });
  } catch (error) {
    req.logger.error(error);
    return await res.status(500).json({ status: false, message: 'Error closing session', error });
  }
}

export async function checkConnectionSession(req, res) {
  try {
    await req.client.isConnected();

    return res.status(200).json({ status: true, message: 'Connected' });
  } catch (error) {
    return res.status(200).json({ status: false, message: 'Disconnected' });
  }
}

export async function getSessionState(req, res) {
  try {
    const { waitQrCode = false } = req.body;
    const client = req.client;

    if ((client == null || client.status == null) && !waitQrCode)
      return res.status(200).json({ status: 'CLOSED', qrcode: null });
    else if (client != null)
      return res.status(200).json({
        status: client.status,
        qrcode: client.qrcode,
        urlcode: client.urlcode,
      });
  } catch (ex) {
    req.logger.error(ex);
    return res.status(500).json({ status: 'error', message: 'The session is not active' });
  }
}

export async function restartService(req, res) {
  try {
    return res.status(200).json({ status: 'success', response: req.client.restartService() });
  } catch (ex) {
    req.logger.error(ex);
    return res.status(500).json({ status: 'error', response: { message: 'The session is not active' } });
  }
}
