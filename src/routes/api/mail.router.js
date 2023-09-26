import CustomRouter from "../../middlewares/routes/CustomRouter.js";
import { sendMail, sendPasswordResetEmail } from '../../utils/mailManager.js';
import ROLES from "../../utils/userRoles.js";

const mailRouter = new CustomRouter();

mailRouter.get('/',
    [ROLES.PUBLIC],
    async (req, res) => {
        try {
            // Llama a la función sendMail para enviar el correo electrónico
            await sendMail();

            // Si el envío del correo fue exitoso, devuelve una respuesta con éxito
            res.status(200).json({
                success: true,
                message: 'Correo electrónico enviado correctamente.'
            });
        } catch (error) {
            // Si hubo algún error durante el envío del correo, devuelve un mensaje de error
            res.status(500).json({
                success: false,
                message: 'Hubo un error al enviar el correo electrónico.'
            });
        }
    }
);

mailRouter.post('/forgot-password',
    [ROLES.PUBLIC], 
    async (req, res) => {
        const { email } = req.body;
        try {
            
            await sendPasswordResetEmail(email);
            res.status(200).json({
                success: true,
                message: 'Correo de restablecimiento de contraseña enviado correctamente.'
            });
        } catch (error) {
            
            res.status(500).json({
                success: false,
                message: 'Hubo un error al enviar el correo de restablecimiento de contraseña.'
            });
        }
    }
);

export default mailRouter;