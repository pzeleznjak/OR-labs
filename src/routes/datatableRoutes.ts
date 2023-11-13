import express, { Request, Response } from 'express';

var router = express.Router();

router.get('/', (req:Request, res:Response) => {    
    res.render('datatable', {
        linkActive: 'datatable'
    });
});

export default {
    router
};