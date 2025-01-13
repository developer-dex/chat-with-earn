import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { adminController } from "../modules/admin/admin.controller";
import { FileUploadMiddleware } from "../middlewares/fileupload.middleware";

const AdminDashboardApi: Router = Router();

const authMiddleware = new AuthMiddleware();

const fileUploadMiddleware = new FileUploadMiddleware();

// AdminDashboardApi.use(authMiddleware.verifyjwtToken);
AdminDashboardApi.post("/login", adminController.adminLogin);
AdminDashboardApi.get("/user-list", authMiddleware.verifyjwtToken, adminController.allUsersInformation);
AdminDashboardApi.patch("/change-status", authMiddleware.verifyjwtToken, adminController.chnageTheStatus);
AdminDashboardApi.patch("/edit-profile-and-people-amount", authMiddleware.verifyjwtToken, adminController.editProfileAndPeopleAmount);
AdminDashboardApi.patch("/change-payment-qr-code", authMiddleware.verifyjwtToken, fileUploadMiddleware.uploadPaymentQrCode, adminController.changeThePaymentQrCode);
export default AdminDashboardApi;
