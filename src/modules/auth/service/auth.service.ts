import { IUser, otpTypesEnum, roleEnum } from "../../../common/index.js";
import { userModel, userRepository } from "../../../db/index.js";
import { Request, Response } from "express";
import { badRequestException, compareHash, conflictException, emailEmitter, encrypt, generateHash, successResponse } from "../../../utils/index.js";


class authService {

    private userRepo: userRepository = new userRepository(userModel);
    signUp = async (req: Request, res: Response) => {
        const { name, email, password, phone, gender } = req.body;
        const isEmailExist = await this.userRepo.exists({ email })
        if (isEmailExist) throw new conflictException('Email already exist', { invalidEmail: email });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const confirmationOtp = {
            value: generateHash(otp),
            expiredAt: new Date(Date.now() + 5 * 60 * 1000),
            otpType: otpTypesEnum.CONFIRMATION
        }
        const encryptedPhone = encrypt(phone as string);
        const hashedPassword = generateHash(password as string);
        const newUser = await this.userRepo.createNewDocument({
            name,
            email,
            phone: encryptedPhone,
            password: hashedPassword,
            gender,
            role: roleEnum.TOURIST,
            otps: [confirmationOtp]
        })
        emailEmitter.emit('sendEmail', {
            to: email,
            subject: 'OTP for signup',
            content: `Your OTP is ${otp}`
        })
        return res.json(successResponse("User register successfuly", 201, newUser));
    }
    confirmEmail = async (req: Request, res: Response) => {
        const { email, otp } = req.body;
        const user = await this.userRepo.findOneDocument({ email }, 'email isVerified OTPS');
        if (!user) throw new badRequestException('user not found or already confirmed', { invalidEmail: email });
        if (user.isVerified) {
            throw new badRequestException('Email already confirmed', { invalidEmail: email });
        }
        const confirmationOtp = user.otps.find((otp) => otp.otpType === otpTypesEnum.CONFIRMATION);
        if (!confirmationOtp) {
            throw new badRequestException("No confirmation OTP found");
        }
        if (confirmationOtp.expiredAt < new Date()) {
            throw new badRequestException("OTP expired");
        }

        const isOtpMatch = compareHash(otp, confirmationOtp.value);
        if (!isOtpMatch) throw new badRequestException("Invalid OTP");

        user.isVerified = true;
        user.otps = user.otps?.filter((otp) => otp.otpType !== otpTypesEnum.CONFIRMATION)

        await user.save();
        return res.json(successResponse("Email confirmed successfully", 200))
    }
    sendOtpAgain = async (req: Request, res: Response) => {

        const { email } = req.body;

        const user = await this.userRepo.findOneDocument(
            { email },
            "email isVerified +otps"
        );

        if (!user) throw new badRequestException("User not found");


        if (user.isVerified) throw new badRequestException("Email already verified");


        user.otps = user.otps.filter(
            otp => otp.otpType !== otpTypesEnum.CONFIRMATION
        );

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otps.push({
            value: generateHash(otp),
            expiredAt: new Date(Date.now() + 5 * 60 * 1000),
            otpType: otpTypesEnum.CONFIRMATION
        });

        await user.save();

        emailEmitter.emit("sendEmail", {
            to: email,
            subject: "Confirm your email",
            content: `Your OTP is ${otp}`
        });

        return res.json(successResponse("OTP sent successfully"));
    };
    

}






export default new authService();