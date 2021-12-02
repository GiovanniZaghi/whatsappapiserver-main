import { unlinkAsync } from '../util/functions';

function returnError(req, res, error) {
  req.logger.error(error);
  res.status(500).json({ status: 'Error', message: 'Erro ao enviar a mensagem.' });
}

async function returnSucess(res, data) {
  res.status(201).json({ status: 'success', response: data});
}

export async function sendMessage(req, res) {
  const { phone, message } = req.body;

  try {
    let results = [];
    for (const contato of phone) {
      results.push(await req.client.sendText(contato, message));
    }

    if (results.length === 0) return res.status(400).json('Error sending message');
    req.io.emit('mensagem-enviada', results);
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

export async function sendImage(req, res) {
  const { phone, filename = 'image-api.jpg', caption, path } = req.body;

  if (!path && !req.file)
    return res.status(401).send({
      message: 'Sending the file is mandatory',
    });

  const pathFile = path || req.file.path;

  try {
    let results = [];
    for (const contato of phone) {
      results.push(await req.client.sendImage(contato, pathFile, filename, caption));
    }

    if (results.length === 0) return res.status(400).json('Error sending message');
    if (req.file.path) await unlinkAsync(pathFile);
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

export async function sendFile(req, res) {
  const { phone, path, filename = 'file', message } = req.body;

  if (!path && !req.file)
    return res.status(401).send({
      message: 'Sending the file is mandatory',
    });

  const pathFile = path || req.file.path;

  try {
    let results = [];
    for (const contato of phone) {
      results.push(await req.client.sendFile(contato, pathFile, filename, message));
    }

    if (results.length === 0) return res.status(400).json('Error sending message');
    if (req.file) await unlinkAsync(pathFile);
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}

export async function sendFile64(req, res) {
  const { base64, phone, filename = 'file', message } = req.body;

  if (!base64) return res.status(401).send({ message: 'The base64 of the file was not informed' });

  try {
    let results = [];
    for (const contato of phone) {
      results.push(await req.client.sendFileFromBase64(contato, base64, filename, message));
    }

    if (results.length === 0) return res.status(400).json('Error sending message');
    returnSucess(res, results);
  } catch (error) {
    returnError(req, res, error);
  }
}
