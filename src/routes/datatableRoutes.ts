import express, { Request, Response } from 'express';
import { queryBuilder } from '../public/utils/queryBuilder';
import { database } from '../server';
import { queryResultsToCSV, queryResultsToJSON } from '../public/utils/serializer';
import * as fs from 'fs';

var router = express.Router();

router.get('/', (req:Request, res:Response) => {    
    res.render('datatable', {
        linkActive: 'datatable',
        isUserLoggedIn: req.oidc.user !== undefined,
    });
});

router.post('/', async (req:Request, res:Response) => {
    let searchValue = req.body.search_value;
    let fieldValue = req.body.field_value;

    console.log("search and field value");
    console.log(searchValue, fieldValue);

    if (searchValue === undefined) {
        searchValue = "";
    }

    try {
        var query:string = queryBuilder(searchValue, fieldValue);    
    } catch (error: Error|any) {
        res.render('error', {
            linkActive: 'error',
            isUserLoggedIn: req.oidc.user !== undefined,
            errorTitle: error.name,
            errorDescription: error.message
        });
        return;
    }
    
    console.log(query);

    try {
        var result = await database.query(query);    
    } catch (error: Error|any) {
        res.render('error', {
            linkActive: 'error',
            isUserLoggedIn: req.oidc.user !== undefined,
            errorTitle: error.name,
            errorDescription: error.message
        });
        return;
    }
    
    let rows = result.rows;
    const response = {
        result:rows
    };
    
    try {
        queryResultsToCSV(rows);
        queryResultsToJSON(rows);
    } catch (error: Error|any) {
        res.render('error', {
            linkActive: 'error',
            isUserLoggedIn: req.oidc.user !== undefined,
            errorTitle: error.name,
            errorDescription: error.message
        })
        return;
    }
    
    res.json(response);
});

router.get('/download-csv', (req:Request, res:Response) => {
    const path = "./data_handling/dumps/or_filtered_instructions.csv"
    res.setHeader("Content-Type","text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=or_filtered_instructions.csv");
    const fileStream:fs.ReadStream = fs.createReadStream(path);
    fileStream.pipe(res);
})

router.get('/download-json', (req:Request, res:Response) => {
    const path = "./data_handling/dumps/or_filtered_instructions.json"
    res.setHeader("Content-Type","text/json");
    res.setHeader("Content-Disposition", "attachment; filename=or_instructions.json");
    const fileStream:fs.ReadStream = fs.createReadStream(path);
    fileStream.pipe(res);
})

export default {
    router
};