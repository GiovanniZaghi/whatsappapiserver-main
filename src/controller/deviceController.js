import { contactToArray } from '../util/functions';

export async function getProfilePicFromServer(req, res) {
  const { phone = true } = req.params;
  try {
    let response;
    for (const contato of contactToArray(phone, false)) {
      response = await req.client.getProfilePicFromServer(contato);
    }

    return res.status(200).json({ status: 'success', response: response });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error', message: 'Error on  get profile pic' });
  }
}