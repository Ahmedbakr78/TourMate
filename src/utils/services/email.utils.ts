import nodemailer from 'nodemailer'
import { IEmailArgument } from '../../common/index.js'
import { EventEmitter } from 'node:events'

export const sendEmail = async (
    {
        to,
        cc,
        subject,
        content,
        attachments = []
    }: IEmailArgument
) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD
        },
        tls: { rejectUnauthorized: false }
    })
    const info = await transporter.sendMail({
        from: process.env.USER_EMAIL,
        to,
        cc,
        subject,
        html: content,
        attachments
    })
    return info;
}
export const emailEmitter = new EventEmitter()
emailEmitter.on('sendEmail', async (data: IEmailArgument) => {
    try {
        await sendEmail(data);
    } catch (error) {
        console.error("Email Error:", error);
    }
})
