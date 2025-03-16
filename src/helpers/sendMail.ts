import nodeMailer from "nodemailer";
import getEnvVar from "./util";

export default async function sendMail(email, subject, text) {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.hostinger.com', // Your SMTP server
        port: 465, // SMTP port (e.g., 465 for SSL, 587 for TLS)
        secure: "true", // true for 465, false for other ports
        auth: {
            user: getEnvVar("EMAIL"),
            pass: getEnvVar("PASSWORD"),
        },
    });

    const options = {
        from: getEnvVar("EMAIL"), // Sender email address
        to: email,
        subject: subject,
        html: text,
    };

    try {
        const result = await transporter.sendMail(options);
        console.log("Mail sent:", result.response);
    } catch (error) {
        console.error("Error sending mail:", error);
    }
}
export async function sendErrorMail(email: any, subject: any, text: any) {
    return new Promise((resolve, reject) => {
        const transporter = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: getEnvVar("EMAIL"),
                pass: getEnvVar("PASSWORD"),
            },
        });
        /**
         * Multiple email ids
         */
        const MailList = ["axy@gmail.com", "abc@gmail.com", "123@gmail.com"];
        const options = {
            to: MailList,
            subject: subject,
            html: text,
        };
        transporter.sendMail(options, (error, result) => {
            if (error) {
                reject(() => {
                    console.log(error);
                });
            } else {
                resolve(() => {
                    console.log("Mail sent:", result.response);
                });
            }
        });
    });
}
