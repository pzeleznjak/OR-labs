import { Response } from 'express';
import { database } from '../../server';

export class InstructionsInputObject {
    appointment: string;
    number_of_hours: number;
    hourly_rate: number;
    subject: string;
    lesson: string;
    location: string;
    place: string;
    street: string;
    house_number: string;
    zip_code: string;
    country_name: string;
    parent_first_name: string;
    parent_last_name: string;
    telephone: string;
    email: string;
    area_code: string;
    school: string;
    class: number;
    child_first_name: string;
    child_last_name: string;
  
    constructor(data: any) {
        if (!data ||
            typeof data.appointment !== 'string' ||
            typeof data.number_of_hours !== 'number' ||
            typeof data.hourly_rate !== 'number' ||
            typeof data.subject !== 'string' ||
            typeof data.lesson !== 'string' ||
            typeof data.location !== 'string' ||
            typeof data.place !== 'string' ||
            typeof data.street !== 'string' ||
            typeof data.house_number !== 'string' ||
            typeof data.zip_code !== 'string' ||
            typeof data.country_name !== 'string' ||
            typeof data.parent_first_name !== 'string' ||
            typeof data.parent_last_name !== 'string' ||
            typeof data.telephone !== 'string' ||
            typeof data.email !== 'string' ||
            typeof data.area_code !== 'string' ||
            typeof data.school !== 'string' ||
            typeof data.class !== 'number' ||
            typeof data.child_first_name !== 'string' ||
            typeof data.child_last_name !== 'string') {
            throw new Error('Invalid data structure');
        }
    
        this.appointment = data.appointment;
        this.number_of_hours = data.number_of_hours;
        this.hourly_rate = data.hourly_rate;
        this.subject = data.subject;
        this.lesson = data.lesson;
        this.location = data.location;
        this.place = data.place;
        this.street = data.street;
        this.house_number = data.house_number;
        this.zip_code = data.zip_code;
        this.country_name = data.country_name;
        this.parent_first_name = data.parent_first_name;
        this.parent_last_name = data.parent_last_name;
        this.telephone = data.telephone;
        this.email = data.email;
        this.area_code = data.area_code;
        this.school = data.school;
        this.class = data.class;
        this.child_first_name = data.child_first_name;
        this.child_last_name = data.child_last_name;
    }
}

export function sendErrorResponse(res:Response, errorCode:number, status:string, message:string) {
    let errorObject = {
        "status":status,
        "message":message,
        "response":null
    };

    res.status(errorCode).json(errorObject);
}

export function sendSuccessResponse(res:Response, message:string, response:any) {
    let responseObject = {
        "status":"OK",
        "message":message,
        "response":response
    };
    res.status(200).json(responseObject);
}

export async function addInstructionsToDatabase(instruction:InstructionsInputObject, res:Response): Promise<boolean> {
    try {
        await database.query("BEGIN");

        let countryExists:boolean = (await database.query(`
        SELECT *
        FROM countries
        WHERE country_name = '${instruction.country_name}'
            AND area_code = '${instruction.area_code}'
        `)).rowCount !== 0;
        if (countryExists) {
            var countryID:number = (await database.query(`
            SELECT country_id
            FROM countries
            WHERE country_name = '${instruction.country_name}'
                AND area_code = '${instruction.area_code}'
            `)).rows[0].country_id;
        } else {
            await database.query(`
            INSERT INTO countries (country_name, area_code)
            VALUES
            ('${instruction.country_name}', '${instruction.area_code}')
            `);

            var countryID:number = (await database.query(`
            SELECT country_id 
            FROM countries 
            ORDER BY country_id DESC 
            LIMIT 1
            `)).rows[0].contry_id;    
        }

        let addressExists:boolean = (await database.query(`
        SELECT *
        FROM addresses
        WHERE country_id = ${countryID}
            AND place = '${instruction.place}'
            AND street = '${instruction.street}'
            AND house_number = '${instruction.house_number}'
            AND zip_code = '${instruction.zip_code}'
        `)).rowCount !== 0;
        if (addressExists) {
            var addressID:number = (await database.query(`
            SELECT address_id
            FROM addresses
            WHERE country_id = ${countryID}
                AND place = '${instruction.place}'
                AND street = '${instruction.street}'
                AND house_number = '${instruction.house_number}'
                AND zip_code = '${instruction.zip_code}'
            `)).rows[0].address_id;
        } else {
            await database.query(`
            INSERT INTO addresses (country_id, place, street, house_number, zip_code)
            VALUES
            (${countryID}, '${instruction.place}', '${instruction.street}', '${instruction.house_number}', '${instruction.zip_code}')
            `);

            var addressID:number = (await database.query(`
            SELECT address_id 
            FROM addresses 
            ORDER BY address_id DESC 
            LIMIT 1
            `)).rows[0].address_id;
        }

        let parentPersonalInformationsExist:boolean = (await database.query(`
        SELECT *
        FROM personal_informations
        WHERE first_name = '${instruction.parent_first_name}'
            AND last_name = '${instruction.parent_last_name}'
        `)).rowCount !== 0;
        if (parentPersonalInformationsExist) {
            var parentPersonalInformationID: number = (await database.query(`
            SELECT personal_information_id
            FROM personal_informations
            WHERE first_name = '${instruction.parent_first_name}'
                AND last_name = '${instruction.parent_last_name}'
            `)).rows[0].personal_information_id;
        } else {
            await database.query(`
            INSERT INTO personal_informations (first_name, last_name)
            VALUES
            ('${instruction.parent_first_name}', '${instruction.parent_last_name}')
            `);

            var parentPersonalInformationID: number = (await database.query(`
            SELECT personal_information_id 
            FROM personal_informations
            ORDER BY personal_information_id DESC 
            LIMIT 1
            `)).rows[0].personal_information_id;
        }

        let contactExists: boolean = (await database.query(`
        SELECT *
        FROM contacts
        WHERE country_id = ${countryID}
            AND telephone = '${instruction.telephone}'
            AND email = '${instruction.email}'
        `)).rowCount !== 0;
        if (contactExists) {
            var contactID: number = (await database.query(`
            SELECT contact_id
            FROM contacts
            WHERE country_id = ${countryID}
                AND telephone = '${instruction.telephone}'
                AND email = '${instruction.email}'
            `)).rows[0].contact_id;
        } else {
            await database.query(`
            INSERT INTO contacts (country_id, telephone, email)
            VALUES
            (${countryID}, '${instruction.telephone}', '${instruction.email}')
            `);

            var contactID: number = (await database.query(`
            SELECT contact_id 
            FROM contacts
            ORDER BY contact_id DESC 
            LIMIT 1
            `)).rows[0].contact_id;
        }

        let parentExists: boolean = (await database.query(`
        SELECT *
        FROM parents
        WHERE personal_information_id = ${parentPersonalInformationID}
            AND contact_id = ${contactID}
        `)).rowCount !== 0;
        if (parentExists) {
            var parentID: number = (await database.query(`
            SELECT parent_id
            FROM parents
            WHERE personal_information_id = ${parentPersonalInformationID}
                AND contact_id = ${contactID}
            `)).rows[0].parent_id;
        } else {
            await database.query(`
            INSERT INTO parents (personal_information_id, contact_id)
            VALUES
            (${parentPersonalInformationID}, ${contactID})
            `);

            var parentID: number = (await database.query(`
            SELECT parent_id 
            FROM parents
            ORDER BY parent_id DESC 
            LIMIT 1
            `)).rows[0].parent_id;
        }

        let childPersonalInformationsExist:boolean = (await database.query(`
        SELECT *
        FROM personal_informations
        WHERE first_name = '${instruction.child_first_name}'
            AND last_name = '${instruction.child_last_name}'
        `)).rowCount !== 0;
        if (childPersonalInformationsExist) {
            var childPersonalInformationID: number = (await database.query(`
            SELECT personal_information_id
            FROM personal_informations
            WHERE first_name = '${instruction.child_first_name}'
                AND last_name = '${instruction.child_last_name}'
            `)).rows[0].personal_information_id;
        } else {
            await database.query(`
            INSERT INTO personal_informations (first_name, last_name)
            VALUES
            ('${instruction.child_first_name}', '${instruction.child_last_name}')
            `);

            var childPersonalInformationID: number = (await database.query(`
            SELECT personal_information_id 
            FROM personal_informations
            ORDER BY personal_information_id DESC 
            LIMIT 1
            `)).rows[0].personal_information_id;
        }

        let childExists: boolean = (await database.query(`
        SELECT *
        FROM children
        WHERE personal_information_id = ${childPersonalInformationID}
            AND school = '${instruction.school}'
            AND class = ${instruction.class}
        `)).rowCount !== 0;
        if (childExists) {
            var childID: number = (await database.query(`
            SELECT child_id
            FROM children
            WHERE personal_information_id = ${childPersonalInformationID}
                AND school = '${instruction.school}'
                AND class = ${instruction.class}
            `)).rows[0].child_id;
        } else {
            await database.query(`
            INSERT INTO children (personal_information_id, school, class)
            VALUES
            (${childPersonalInformationID}, '${instruction.school}', ${instruction.class})
            `);

            var childID: number = (await database.query(`
            SELECT child_id
            FROM children
            ORDER BY child_id DESC
            LIMIT 1
            `)).rows[0].child_id;
        }

        await database.query(`
        INSERT INTO instructions (address_id, parent_id, child_id, appointment, number_of_hours, hourly_rate, subject, lesson, location)
        VALUES
        (${addressID}, ${parentID}, ${childID}, '${instruction.appointment}', ${instruction.number_of_hours}, ${instruction.hourly_rate}, '${instruction.subject}', '${instruction.lesson}', '${instruction.location}')
        `);

        await database.query("END");
        
    } catch (error: Error|any) {
        if (error.code === '23514' || error.code === '23505') {
            console.error('Constraint violation:', error.constraint);
            sendErrorResponse(res, 500, "Bad Request", `Your data violates ${error.constraint} in database - not correctly formatted!`);
            await database.query("ROLLBACK");
            return false;
        }

        console.error(error);
        await database.query("ROLLBACK");
        sendErrorResponse(res, 500, "Internal Server Error", "Error in processing request");
        return false;
    }

    return true;
}

export async function tryDeleteInstructionsFromDatabase(id:number, res:Response): Promise<boolean> {
    const query:string = `
    DELETE 
    FROM instructions 
    WHERE instructions_id = ${id}`

    try {
        var result = await database.query(query);    
    } catch (error: Error|any) {
        sendErrorResponse(res, 500, "Internal Server Error", "Error in processing request");
        return false;
    }

    if (result.rowCount === 0) {
        sendErrorResponse(res, 404, "Not Found", "Instructions with given id do not exist");
        return false;
    }

    return true;
}