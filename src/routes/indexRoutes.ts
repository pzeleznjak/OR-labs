import express, { Request, Response } from 'express';
import * as fs from 'fs'
import { exec, ExecException } from 'child_process';

function fileExists(path: string): boolean {
    try {
        fs.accessSync(path, fs.constants.F_OK);
    } catch (error:Error|any) {
        if (error.code === "ENOENT") {
            return false;
        }
    }
    return true;
}

const SLEEP_MS:number = 2000;
function sleep(ms:number): Promise<void> {
    return new Promise((resolve => setTimeout(resolve, ms)));
}

var router = express.Router();

router.get('/', (req:Request, res:Response) => {    
    res.render('index', {
        linkActive: 'index'
    });
});

router.get('/serve-schema', (req:Request, res:Response) => {
    let path = './data_handling/schema.json'
    res.setHeader("Content-Type","text/json");
    res.setHeader("Content-Disposition", "attachment; filename=schema.json");
    const fileStream:fs.ReadStream = fs.createReadStream(path);
    fileStream.pipe(res);
});

router.get('/serve-csv', async (req:Request, res:Response) => {
    const path = './data_handling/dumps/or_instructions.csv'

    if (!fileExists(path)) {
        exec(`./rundumps.sh dump_db_to_csv.py ${process.env.SUDO_PASS}`, (error: ExecException | null, stdout: string, stderr: string) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            if (stdout) {
                console.log(`stdout: ${stdout}`);
                return;
            }
        });
        await sleep(SLEEP_MS);
    }

    if (!fileExists(path)) {
        res.render('error', {
            errorTitle: "File Not Found",
            errorDescription: `File ${path} is not found!\nAn error occured on backend during extraction of data to .csv!`
        });
        return;
    }

    res.setHeader("Content-Type","text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=or_instructions.csv");
    const fileStream:fs.ReadStream = fs.createReadStream(path);
    fileStream.pipe(res);  
});

router.get('/serve-json', async (req:Request, res:Response) => {
    const path = './data_handling/dumps/or_instructions.json'

    if (!fileExists(path)) {
        exec(`./rundumps.sh dump_db_to_json.py ${process.env.SUDO_PASS}`, (error: ExecException | null, stdout: string, stderr: string) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            if (stdout) {
                console.log(`stdout: ${stdout}`);
                return;
            }
        });
        await sleep(SLEEP_MS);
    }

    if (!fileExists(path)) {
        res.render('error', {
            errorTitle: "File Not Found",
            errorDescription: `File ${path} is not found!\nAn error occured on backend during extraction of data to .json!`
        });
        return;
    }

    res.setHeader("Content-Type","text/json");
    res.setHeader("Content-Disposition", "attachment; filename=or_instructions.json");
    const fileStream:fs.ReadStream = fs.createReadStream(path);
    fileStream.pipe(res);
});

export default {
    router
};