import { mailtrapClient, sender } from "./mailtrap.config.js"
import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        })
        console.log("Email sent successfully:", response);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send verification email: " + error.message);
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}]

    try {
        await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "f6f4b271-433f-43db-bffe-fd94d5ea7985",
            template_variables: {
                "company_info_name": "Auth-test",
                "name": name
            }
        });

        console.log("Welcome email sent successfully");
    } catch (error) {
        console.error("Error sending welcome email:", error);
        throw new Error("Failed to send welcome email: " + error.message);
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        });
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error("Failed to send password reset email: " + error.message);
    }
}
