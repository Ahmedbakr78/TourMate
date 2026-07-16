import jwt, { JwtPayload, Secret, SignOptions, VerifyOptions } from "jsonwebtoken"
import { ITokenPayload } from "../../common/index.js"



export const generateToken = (
    payload: ITokenPayload,
    secretOrPrivateKey: Secret = process.env.JWT_ACCESS_SECRET as string,
    options?: SignOptions
): string => {
    return jwt.sign(payload, secretOrPrivateKey, options)
}


export const verifyToken = (
    token: string,
    secretOrPrivateKey: Secret = process.env.JWT_ACCESS_SECRET as string,
    options?: VerifyOptions
): ITokenPayload => {
    return jwt.verify(token, secretOrPrivateKey, options) as ITokenPayload
}
