import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { adminController } from "../modules/admin/admin.controller";
import { FileUploadMiddleware } from "../middlewares/fileupload.middleware";

const AdminDashboardApi: Router = Router();

const authMiddleware = new AuthMiddleware();

const fileUploadMiddleware = new FileUploadMiddleware();

// AdminDashboardApi.use(authMiddleware.verifyjwtToken);
AdminDashboardApi.post("/login", adminController.adminLogin);
AdminDashboardApi.get("/user-list", adminController.allUsersInformation);
AdminDashboardApi.patch("/change-status", adminController.chnageTheStatus);
AdminDashboardApi.patch("/edit-user-profile", adminController.editUserProfile);
AdminDashboardApi.patch("/change-payment-qr-code", fileUploadMiddleware.uploadPaymentQrCode, adminController.changeThePaymentQrCode);
AdminDashboardApi.get("/payment-photo", adminController.getPaymentPhoto);

export default AdminDashboardApi;
