import mongoose from "mongoose";
import User from "../../models/User";


export class PeopleService {
    constructor() {
        
    }
    peopleList = async (userId: string, page: string, limit: string) => {
        console.log("userId", userId);
        const totalPeople = await User.count({
            approved_by_admin: true,
            _id: { $ne: userId },
        });

        const people = await User.find({
            where: {
                approved_by_admin: true,
            },
            skip: parseInt(page) * parseInt(limit),
            limit: parseInt(limit),
        });

        // Filter users based on userId remove user which is related to userId  
        const filteredPeople = people.filter((person) => person._id.toString() !== userId);

        return { people: filteredPeople, total_count: totalPeople };
    }
}