import mongoose from "mongoose";
import User from "../../models/User";


export class PeopleService {
    constructor() {
        
    }
    peopleList = async (userId: string, page: string, limit: string, collage?: string, area?: string, age?: string, gender?: string) => {
        console.log("userId", userId);
        const queryCount: any = {
            approved_by_admin: true,
            _id: { $ne: userId },
        };

        // Add filters to the count query if they are provided
        if (collage) queryCount.collage_name = { $regex: new RegExp(collage, 'i') }; // Case insensitive
        if (area) queryCount.area = { $regex: new RegExp(area, 'i') }; // Case insensitive
        if (age) {
            const currentDate = new Date();
            const minDate = new Date(currentDate.getFullYear() - parseInt(age), currentDate.getMonth(), currentDate.getDate());
            const maxDate = new Date(currentDate.getFullYear() - parseInt(age) + 1, currentDate.getMonth(), currentDate.getDate());
            queryCount.dob = { $gte: minDate, $lt: maxDate }; // Assuming 'dob' is the field name in your User schema
        }
        if (gender) queryCount.gender = gender;

        const totalPeople = await User.count(queryCount);

        

        const query: any = {
            approved_by_admin: true,
        };

        // Add filters to the query if they are provided
        if (collage) query.collage_name = { $regex: new RegExp(collage, 'i') }; // Case insensitive
        if (area) query.area = { $regex: new RegExp(area, 'i') }; // Case insensitive
        if (age) {
            const currentDate = new Date();
            const minDate = new Date(currentDate.getFullYear() - parseInt(age), currentDate.getMonth(), currentDate.getDate());
            const maxDate = new Date(currentDate.getFullYear() - parseInt(age) + 1, currentDate.getMonth(), currentDate.getDate());
            query.dob = { $gte: minDate, $lt: maxDate }; // Assuming 'dob' is the field name in your User schema
        }
        if (gender) query.gender = { $regex: new RegExp(gender, 'i') };

        console.log("query", query);
        const people = await User.find(query)
            .skip(((parseInt(page) - 1) * parseInt(limit)))
            .limit(parseInt(limit));

        // Filter users based on userId remove user which is related to userId  
        // console.log("people", people);
        const filteredPeople = people.filter((person) => person._id.toString() !== userId);

        // Add the specified fields to the response
        const response = filteredPeople.map(person => ({
            collage: person.collage_name,
            gender: person.gender,
            age: person.dob ? new Date().getFullYear() - person.dob.getFullYear() : null, // Calculate age
            first_name: person.first_name,
            last_name: person.last_name,
            is_status: person.is_active,
            amount: 100 // Static amount
        }));

        return { people: response, total_count: totalPeople };
    }
}