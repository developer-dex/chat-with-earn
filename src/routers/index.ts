import { Router } from "express";
import WebsiteApi from "./website";
import AdminDashboardApi from "./adminDashboard";

const MainRoute = Router();

MainRoute.use("/api", WebsiteApi);
MainRoute.use("/api/admin", AdminDashboardApi);

export default MainRoute;
