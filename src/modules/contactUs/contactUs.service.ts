import ContactUs from "../../models/ContactUs";
import { IContactUsRequest } from "./contactUs.interface";

export class ContactUsService {
    constructor() {}

    contactUsRequest = async (contactUsRequestpayload: IContactUsRequest) => {
        await ContactUs.create(contactUsRequestpayload);
    };
}
