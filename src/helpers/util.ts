import "dotenv/config";
export default function getEnvVar(envVarName: string | number): string {
    const value = process.env[envVarName];

    if (!value) {
        throw new Error(`environment variable ${envVarName} is not set`);
    }

    return value;
}

export const generateOtp = (digit: number) => {
    let otp = "";
    for (let i = 0; i < digit; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return Number(otp);
};

export const calculateAge = (dob: Date) => {
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    return age;
};

export const generateRandomString = (length: number) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }

    return result;
};

export const parseTimeInterval = (interval: string) => {
    const regex = /^(\d+)([smhdwMy])$/;
    const matches = interval.match(regex);

    if (matches) {
        const value = parseInt(matches[1], 10);
        const unit = matches[2];

        switch (unit) {
            case "s":
                return { ms: value * 1000, long: value + " " + "Seconds" };
            case "m":
                return { ms: value * 60000, long: value + " " + "Minutes" };
            case "h":
                return { ms: value * 3600000, long: value + " " + "Hours" };
            case "d":
                return { ms: value * 86400000, long: value + " " + "Days" };
            case "w":
                return { ms: value * 604800000, long: value + " " + "Weeks" };
            case "M":
                return { ms: value * 2592000000, long: value + " " + "Months" };
            case "y":
                return { ms: value * 31536000000, long: value + " " + "Years" };
        }
    }

    return { ms: 0, long: "" }; // Invalid time interval format
};
