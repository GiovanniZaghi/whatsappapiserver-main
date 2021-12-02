import { contactToArray } from '../util/functions';

export default async function statusConnection(req, res, next) {
  try {
    if (req.client && req.client.isConnected) {
      await req.client.isConnected();

      let localArr = contactToArray(req.body.phone || [], req.body.isGroup);

      let index = 0;
      for (const contact of localArr) {
        if (req.body.isGroup) {
          localArr[index] = contact;
        } else if (numbers.indexOf(contact) < 0) {
          let profile = await req.client.checkNumberStatus(contact).catch((error) => console.log(error));
          if (!profile.numberExists) {
            const num = contact.split('@')[0];
            return res.status(400).json({
              response: null,
              status: 'Connected',
              message: `O número ${num} não existe.`,
            });
          } else {
            if (numbers.indexOf(profile.id._serialized) < 0) {
              numbers.push(profile.id._serialized);
            }
            localArr[index] = profile.id._serialized;
          }
        }
        index++;
      }
      req.body.phone = localArr;
    } else {
      return res.status(404).json({
        response: null,
        status: 'Disconnected',
        message: 'A sessão do WhatsApp não está ativa.',
      });
    }
    next();
  } catch (error) {
    req.logger.error(error);
    return res.status(404).json({
      response: null,
      status: 'Disconnected',
      message: 'A sessão do WhatsApp não está ativa.',
    });
  }
}
let numbers = [];
