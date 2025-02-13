import "dotenv/config";
import moment from "moment";
import multer from "multer";


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

export const calculateAge = (dob: string) => {
    const dateOfBirth = new Date(dob); // Convert string to Date object

    if (!(dateOfBirth instanceof Date) || isNaN(dateOfBirth.getTime())) {
        throw new Error("Invalid date provided");
    }

    const age = moment().diff(moment(dateOfBirth), 'years'); // Calculate age using moment
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


// const formatTimeAgo = (date: Date) => {
//     const now = new Date();
//     const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
//     let interval = Math.floor(seconds / 31536000);
//     if (interval > 1) return `${interval} years ago`;
//     interval = Math.floor(seconds / 2592000);
//     if (interval > 1) return `${interval} months ago`;
//     interval = Math.floor(seconds / 86400);
//     if (interval > 1) return `${interval} days ago`;
//     interval = Math.floor(seconds / 3600);
//     if (interval > 1) return `${interval} hours ago`;
//     interval = Math.floor(seconds / 60);
//     if (interval > 1) return `${interval} minutes ago`;
//     return `${seconds} seconds ago`;
// };

export const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const days = Math.floor(seconds / 86400);
    
    if (days > 1) {
        return date.toLocaleDateString(); // Show date if more than 24 hours
    } else {
        let interval = Math.floor(seconds / 3600);
        if (interval > 1) return `${interval} hours ago`;
        interval = Math.floor(seconds / 60);
        if (interval > 1) return `${interval} minutes ago`;
        return `Just now`;
    }
};

export const randomNumberFrom1To10 = () => {
    return Math.floor(Math.random() * 10) + 1;
}

export const randomText = () => {
    const messages = [
        "Hello, how are you?",
        "I am fine, thank you!",
        "Hope you're having a great day!",
        "What are your plans for today?",
        "It's nice to connect with you!"
    ];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

export const getRandomDate = () => {
    const start = new Date();
    const end = new Date(start);
    end.setDate(start.getDate() - 30);
    return new Date(start.getTime() - Math.random() * (start.getTime() - end.getTime()));
};

export const calculatePagination = (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    return { offset, limit };
};

export const createMulterMiddleware = (uploadPath: string) => {
    // ... existing code ...

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const timestamp = moment().format("YYYYMMDD_HHmmss"); // Get current timestamp
            cb(null, `${timestamp}_${file.originalname}`); // Append timestamp to original file name
        },
    });

    return multer({ storage: storage });
};