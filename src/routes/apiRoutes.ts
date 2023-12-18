import express, { Request, Response } from 'express';
import { database } from '../server';
import * as fs from 'fs';
import { InstructionsInputObject, addInstructionsToDatabase as tryAddInstructionsToDatabase, sendErrorResponse, sendSuccessResponse, tryDeleteInstructionsFromDatabase } from '../public/utils/apiUtils';
import path from 'path';

var router = express.Router();

router.get('/all-instructions/', async (req:Request, res:Response) => {
    const query:string = "SELECT * FROM instructions_single_table";

    try {
        var result = await database.query(query);    
    } catch (error: Error|any) {
        sendErrorResponse(res, 500, "Internal Server Error", "Error in processing request");
        return;
    }

    sendSuccessResponse(res, "Fetched all instructions", result.rows);
    return;
});

router.get('/single-instructions/:id', async (req:Request, res:Response) => {
    const instructionsId:string = req.params.id;
    const id = parseInt(instructionsId);
    if (isNaN(id)) {
        sendErrorResponse(res, 400, "Bad Request", "Request parameter 'id' must be integer");
        return;
    }

    const query:string = `
    SELECT * 
    FROM instructions_single_table 
    WHERE instructions_id = ${id}`

    try {
        var result = await database.query(query);    
    } catch (error: Error|any) {
        sendErrorResponse(res, 500, "Internal Server Error", "Error in processing request");
        return;
    }

    if (result.rowCount === 0) {
        sendErrorResponse(res, 404, "Not Found", "Instructions with given id do not exist");
        return;
    }

    sendSuccessResponse(res, `Fetched intructions with id ${id}`, result.rows);
    return;
});

router.get('/ins-by-subject/:subject', async (req:Request, res:Response) => {
    const subject:string = req.params.subject;

    if (subject === undefined) {
        sendErrorResponse(res, 400, "Bad Request", "Request parameter 'subject' must be defined");
        return;
    }

    const query:string = `
    SELECT * 
    FROM instructions_single_table 
    WHERE subject = '${subject}'`

    try {
        var result = await database.query(query);    
    } catch (error: Error|any) {
        sendErrorResponse(res, 500, "Internal Server Error", "Error in processing request");
        return;
    }

    if (result.rowCount === 0) {
        sendErrorResponse(res, 404, "Not Found", "Instructions on given subject do not exist");
        return;
    }

    sendSuccessResponse(res, `Fetched intructions on subject ${subject}`, result.rows);
    return;
});

router.get('/ins-by-location/:location', async (req:Request, res:Response) => {
    const location:string = req.params.location;

    console.log(location);

    if (location === undefined) {
        sendErrorResponse(res, 400, "Bad Request", "Request parameter 'location' must be defined");
        return;
    }

    const query:string = `
    SELECT * 
    FROM instructions_single_table 
    WHERE location = '${location}'`

    try {
        var result = await database.query(query);    
    } catch (error: Error|any) {
        sendErrorResponse(res, 500, "Internal Server Error", "Error in processing request");
        return;
    }

    if (result.rowCount === 0) {
        sendErrorResponse(res, 404, "Not Found", "Instructions on given subject do not exist");
        return;
    }

    sendSuccessResponse(res, `Fetched intructions on location ${location}`, result.rows);
    return;
});

router.get('/ins-by-hourly-rate/:rate', async (req:Request, res:Response) => {
    const instructionsRate:string = req.params.rate;
    const rate = parseFloat(instructionsRate);
    if (isNaN(rate)) {
        sendErrorResponse(res, 400, "Bad Request", "Request parameter 'rate' must be a number");
        return;
    }

    const query:string = `
    SELECT * 
    FROM instructions_single_table 
    WHERE hourly_rate = ${rate}`

    try {
        var result = await database.query(query);    
    } catch (error: Error|any) {
        sendErrorResponse(res, 500, "Internal Server Error", "Error in processing request");
        return;
    }

    if (result.rowCount === 0) {
        sendErrorResponse(res, 404, "Not Found", "Instructions with given hourly rate do not exist");
        return;
    }

    sendSuccessResponse(res, `Fetched intructions with hourly rate ${rate}`, result.rows);
    return;
});

router.post('/add-instructions', async (req:Request, res:Response) => {
    const requestData = req.body;
    
    try {
        var instruction = new InstructionsInputObject(requestData);
    } catch (error: Error|any) {
        sendErrorResponse(res, 400, "Bad Request", "Invalid data in request body");
        return;
    }

    if (!tryAddInstructionsToDatabase(instruction, res)) {
        return;
    }
    
    sendSuccessResponse(res, "Instructions successfully added", null);
    return;
});

router.put('/update-instructions/:id', async (req:Request, res:Response) => {
    let instructionsID: string = req.params.id;
    const id = parseInt(instructionsID)
    if (isNaN(id)) {
        sendErrorResponse(res, 400, "Bad Request", "Request parameter 'id' must be integer");
        return;
    }

    const requestData = req.body;
    try {
        var instruction = new InstructionsInputObject(requestData);
    } catch (error: Error|any) {
        sendErrorResponse(res, 400, "Bad Request", "Invalid data in request body");
        return;
    }

    if (!tryDeleteInstructionsFromDatabase(id, res)) {
        return;
    }
    if (!tryAddInstructionsToDatabase(instruction, res)) {
        return;
    }
    try {
        var newInstructionsID: number = (await database.query(`
        SELECT instructions_id
        FROM instructions
        ORDER BY instructions_id DESC
        LIMIT 1
        `)).rows[0].instructions_id;
        const query = `
        UPDATE instructions
        SET instructions_id = ${id}
        WHERE instructions_id = ${newInstructionsID}
        `
        console.log(query);
        await database.query(query);
    } catch (error: Error|any) {
        sendErrorResponse(res, 500, "Internal Server Error", "Error in processing request");
        return;
    }

    sendSuccessResponse(res, "Instructions successfully updated", null);
    return;
});

router.delete('/delete-instructions/:id', async (req:Request, res:Response) => {
    const instructionsId:string = req.params.id;
    const id = parseInt(instructionsId);
    if (isNaN(id)) {
        sendErrorResponse(res, 400, "Bad Request", "Request parameter 'id' must be integer");
        return;
    }

    if (!tryDeleteInstructionsFromDatabase(id, res)) {
        return;
    }

    sendSuccessResponse(res, `Deleted intructions with id ${id}`, null);
    return;
});

router.get('/openapi', (req:Request, res:Response) => {
    const file = "/openapi.json";
    const fullPath = path.join(process.cwd(), file)
    let success = true;
    const data = {};
    fs.readFile(fullPath, "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            sendErrorResponse(res, 500, "Internal Server Error", "Error in processing request");
            success = false;
            return;
        }
    
        try {
            data = JSON.parse(data);
        } catch (parseError) {
            sendErrorResponse(res, 500, "Internal Server Error", "Error in processing request");
            success = false;
            return;
        }
        sendSuccessResponse(res, "openapi.json fetched succesfully", data);
    });
});

export default {
    router
};