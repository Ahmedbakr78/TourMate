import { IRequest, IUser, otpTypesEnum, roleEnum, statusUserEnum } from "../../../common/index.js";
import { blackListedTokensModel, blackListedTokensRepository, userModel, userRepository } from "../../../db/index.js";
import { Request, Response } from "express";
import { badRequestException, compareHash, conflictException, emailEmitter, encrypt, generateHash, generateToken, successResponse, unauthorizedException, verifyToken } from "../../../utils/index.js";
import { v4 as uuidv4 } from "uuid";
import { SignOptions } from "jsonwebtoken";


class authService {

    private userRepo: userRepository = new userRepository(userModel);
    private blacklistedTokenRepo: blackListedTokensRepository = new blackListedTokensRepository(blackListedTokensModel);

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
        if (confirmationOtp.expiredAt.getTime() < Date.now()) {
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

        const user = await this.userRepo.findOneDocument({ email }, "email isVerified +otps");
        if (!user) throw new badRequestException("User not found");
        if (user.isVerified) throw new badRequestException("Email already verified");
        user.otps = user.otps.filter(otp => otp.otpType !== otpTypesEnum.CONFIRMATION);

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
    signIn = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await this.userRepo.findOneDocument({ email }, 'email +password isVerified role');
        if (!user) throw new badRequestException('Invalid email or password', { invalidEmail: email });
        if (!user.password) throw new badRequestException('Password is required');

        const isPasswordMatch = compareHash(password, user.password);
        if (!isPasswordMatch) throw new badRequestException('Invalid email or password', { invalidEmail: email });
        if (!user.isVerified) throw new badRequestException("Please confirm your email first");
        if (user.status !== statusUserEnum.ACTIVE) {
            throw new unauthorizedException("Your account is blocked");
        }
        const accessToken = generateToken(
            {
                _id: user._id.toString(),
                email: user.email,
                role: user.role,
            },
            process.env.JWT_ACCESS_SECRET as string,
            {
                expiresIn: process.env.JWT_ACCESS_EXPIRE_IN as SignOptions["expiresIn"],
                jwtid: uuidv4()
            }
        )
        const refreshToken = generateToken(
            {
                _id: user._id.toString(),
                email: user.email,
                role: user.role,
            },
            process.env.JWT_REFRESH_SECRET as string,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRE_IN as SignOptions["expiresIn"],
                jwtid: uuidv4()
            }
        )
        res.json(successResponse("User signed in successfully", 200, { tokens: { accessToken, refreshToken } }))
    }
    refreshToken = async (req: Request, res: Response) => {
        const { refreshToken: token } = req.body;
        if (!token) throw new badRequestException("Refresh token is required");
        const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET as string)
        if (!decoded?._id) throw new badRequestException("Invalid refresh token");
        const blackListedToken = await this.blacklistedTokenRepo.findOneDocument({ tokenId: decoded.jti });
        if (blackListedToken) throw new badRequestException("Refresh token is blacklisted, please log in again");
        const user = await this.userRepo.findDocumentById(decoded._id);
        if (!user) throw new badRequestException("User not found");

        if (!user.isVerified) throw new unauthorizedException('Please verify your account first');
        if (user.status !== statusUserEnum.ACTIVE) throw new unauthorizedException('Your account is blocked');

        const newAccessToken = generateToken(
            {
                _id: user._id.toString(),
                email: user.email,
                role: user.role,
            },
            process.env.JWT_ACCESS_SECRET as string,
            {
                expiresIn: process.env.JWT_ACCESS_EXPIRE_IN as SignOptions["expiresIn"],
                jwtid: uuidv4()
            }
        );
        res.json(successResponse("Access token refreshed successfully", 200, { accessToken: newAccessToken }))
    }
    logOut = async (req: IRequest, res: Response) => {
        const { tokenData: { jti, exp } } = req.loggedInUser!
        await this.blacklistedTokenRepo.createNewDocument({
            tokenId: jti,
            expiresAt: new Date((exp as number) * 1000)
        });
        res.json(successResponse("User logged out successfully", 200));
    }
    forgotPassword = async (req: IRequest, res: Response) => {
        const { email } = req.body;
        if (!email) throw new badRequestException('Email is required');
        const existingUser = await this.userRepo.findOneDocument({ email });
        if (!existingUser) throw new badRequestException("User not found");

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const resetOtp = {
            value: generateHash(otp),
            expiredAt: new Date(Date.now() + 5 * 60 * 1000),
            otpType: otpTypesEnum.RESET_PASSWORD
        }
        existingUser.otps = existingUser.otps?.filter(
            (otpObj) => otpObj.otpType !== otpTypesEnum.RESET_PASSWORD
        )
        existingUser.otps?.push(resetOtp);
        await existingUser.save();
        emailEmitter.emit('sendEmail', {
            to: email,
            subject: 'Reset password Code',
            content: `Your password reset is ${otp}`
        })
        res.json(successResponse("Password reset otp sent to your email", 200));
    }
    resetPassword = async (req: IRequest, res: Response) => {

        const { email, otp, newPassword } = req.body;
        if (!email) throw new badRequestException("Email is required");
        if (!otp) throw new badRequestException("OTP is required");
        if (!newPassword) throw new badRequestException("New password is required");


        const user = await this.userRepo.findOneDocument({ email }, "+password +otps");
        if (!user) throw new badRequestException("User not found");

        const resetOtp = user.otps.find(otpObj => otpObj.otpType === otpTypesEnum.RESET_PASSWORD);
        if (!resetOtp) throw new badRequestException("No reset password OTP found");
        if (resetOtp.expiredAt.getTime() < Date.now()) {
            throw new badRequestException("OTP expired");
        }

        const isOtpMatch = compareHash(otp, resetOtp.value);
        if (!isOtpMatch) throw new badRequestException("Invalid OTP");

        user.password = generateHash(newPassword);
        user.otps = user.otps.filter(otpObj => otpObj.otpType !== otpTypesEnum.RESET_PASSWORD);
        await user.save();

        return res.json(successResponse("Password reset successfully", 200));
    }
    changePassword = async (req: IRequest, res: Response) => {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword) throw new badRequestException("Old password is required");
        if (!newPassword) throw new badRequestException("New password is required");
        const user = await this.userRepo.findDocumentById(
            req.loggedInUser!.user._id,
            '+password'
        );

        if (!user || !user.password) {
            throw new badRequestException('User not found');
        }

        const isOldPasswordCorrect = compareHash(oldPassword, user.password);

        if (!isOldPasswordCorrect) throw new badRequestException('Old password is incorrect');
        if (oldPassword === newPassword) {
            throw new badRequestException("New password must be different");
        }
        user.password = generateHash(newPassword);
        await user.save();

        return res.json(successResponse('Password changed successfully', 200));
    };
    

}







export default new authService();