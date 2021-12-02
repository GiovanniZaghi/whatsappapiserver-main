import * as Yup from 'yup';
import User from '../models/User';

class UserController{
    async store(req, res){

        const schema = Yup.object().shape({
            instance: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            status: Yup.number().required()
        });

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error : 'Falha na validação'});
        }

        const userExist = await User.findOne({
            where: {email: req.body.email}
        });

        if(userExist){
            return res.status(400).json({error: "Usuário já existe."});
        }

        const {id, instance, email, status} = await User.create(req.body);

        return res.json({
            id,
            instance,
            email,
            status
        });
    }
}

export default new UserController();