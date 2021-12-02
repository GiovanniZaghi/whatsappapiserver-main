import bcrypt from 'bcrypt';
import * as Yup from 'yup';
import User from '../models/User';

const saltRounds = 10;

export async function encryptSession(req, res) {
  const { secretkey } = req.params;
  const { authorization: token } = req.headers;

  const {email, password} = req.body;

  const schema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required().min(6),
  });

  if(!(await schema.isValid(req.body))){
    return res.status(400).json({error : 'Falha na validação'});
  }

  //verifica se existe email
  const user = await User.findOne({where: { email }});

  if(!user){
      return res.status(401).json({error: 'Usuário não existe.'});
  }

  //verificar se a senha é diferente
  if(!(await user.checkPassword(password))){
      return res.status(401).json({error: 'Senha incorreta.'}); 
  }

  if(user.status != 1){
    return res.status(401).json({error: 'Conta inativa, por favor entre em contato.'}); 
  }

  const session = user.instance;

  bcrypt.hash(session, saltRounds, function (err, hash) {
    if (err) return res.status(500).json(err);

    const hashFormat = hash.replace(/\//g, '_').replace(/\+/g, '-');
    return res.status(201).json({
      status: 'success',
      session: session,
      token: hashFormat,
      full: `${session}:${hashFormat}`,
    });
  });
}
