import express, { Request, Response } from 'express';
import { queryBuilder } from '../public/utils/queryBuilder';
import { database } from '../server';

var router = express.Router();

router.get('/', (req:Request, res:Response) => {    
    res.render('datatable', {
        linkActive: 'datatable'
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
            errorTitle: error.name,
            errorDescription: error.message
        });
        return;
    }
    
    try {
        var result = await database.query(query);    
    } catch (error: Error|any) {
        res.render('error', {
            errorTitle: error.name,
            errorDescription: error.message
        });
        return;
    }
    
    let rows = result.rows;
    const response = {
        result:rows
    };
    console.log(response);

    res.json(response);
});

export default {
    router
};