
import jwt from 'jsonwebtoken';
import { Payload } from '../../interfaces';

class JwtService {
    static sign(payload : Payload, expiry = "1h", secret = process.env.JWT_SECRET) {
        return jwt.sign(payload, secret!, { expiresIn: expiry});
    }

    static verify(token : string, secret = process.env.JWT_SECRET) {
        return jwt.verify(token, secret!);
    }
}

export default JwtService;
