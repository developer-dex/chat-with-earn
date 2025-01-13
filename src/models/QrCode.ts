
import mongoose from "mongoose";

const QrCodeSchema = new mongoose.Schema({
    qr_code_image: { type: String, required: true },
}, {
    timestamps: true,
});

const QrCode = mongoose.model("QrCode", QrCodeSchema);
export default QrCode;