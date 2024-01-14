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

function refreshCSVSnapshot(): void {
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
}

function refreshJSONSnapshot(): void {
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
}

function addSemanticsToJSONFile(pathToJSONFile: string): void {
    const JSONData = fs.readFileSync(pathToJSONFile, 'utf-8');
    const parsedData = JSON.parse(JSONData);

    for (let i = 0; i < parsedData.length; i++) {
        parsedData[i]["@context"] = {
            schema:"http://schema.org/",
            appointment:"schema:startDate",
            number_of_hours:"schema:duration"
        },
        parsedData[i]["@type"] = "schema:CourseInstance";
        parsedData[i]["address"]["@type"] = "schema:PostalAddress";
        parsedData[i]["address"]["country"]["@type"] = "schema:Country";
        parsedData[i]["parent"]["@type"] = "schema:Person";
        parsedData[i]["parent"]["personal_information"]["@type"] = "schema:ContactPoint";
        parsedData[i]["parent"]["contact"]["@type"] = "schema:ContactPoint";
        parsedData[i]["parent"]["contact"]["country"]["@type"] = "schema:Country";
        parsedData[i]["child"]["@type"] = "schema:Person";
        parsedData[i]["child"]["personal_information"]["@type"] = "schema:ContactPoint";
    }

    fs.writeFileSync(pathToJSONFile, JSON.stringify(parsedData, null, 4));
}

var router = express.Router();

router.get('/', (req:Request, res:Response) => {    
    let isUserLoggedIn: boolean = req.oidc.user !== undefined;

    res.render('index', {
        linkActive: 'index',
        isUserLoggedIn: isUserLoggedIn
    });
});

router.get('/profile', (req:Request, res:Response) => {
    if (req.oidc.user === undefined) {
        res.render('error', {
            linkActive: 'error',
            isUserLoggedIn: req.oidc.user !== undefined,
            errorTitle: 'Unauthorized access',
            errorDescription: 'You need to be logged in to access this content'
        })
        return;
    }

    res.render('profile', {
        linkActive: 'profile',
        nickname: req.oidc.user.nickname,
        name: req.oidc.user.name,
        email: req.oidc.user.email,
        updated_at: req.oidc.user.updated_at,
        email_verified: req.oidc.user.email_verified,
        picture: req.oidc.user.picture,
        sid: req.oidc.user.sid,
        sub: req.oidc.user.sub,
        isUserLoggedIn: req.oidc.user !== undefined
    })
});

router.get('/refresh-snapshots', (req:Request, res:Response) => {
    if (req.oidc.user === undefined) {
        res.render('error', {
            linkActive: 'error',
            isUserLoggedIn: req.oidc.user !== undefined,
            errorTitle: 'Unauthorized access',
            errorDescription: 'You need to be logged in to access this content'
        })
        return;
    }

    refreshCSVSnapshot();
    refreshJSONSnapshot();
    res.redirect('/');
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
        refreshCSVSnapshot();
        await sleep(SLEEP_MS);
    }

    if (!fileExists(path)) {
        res.render('error', {
            errorTitle: "File Not Found",
            errorDescription: `File ${path} is not found!\nAn error occured on backend during extraction of data to .csv!`,
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
        refreshJSONSnapshot();
        await sleep(SLEEP_MS);
    }

    if (!fileExists(path)) {
        res.render('error', {
            errorTitle: "File Not Found",
            errorDescription: `File ${path} is not found!\nAn error occured on backend during extraction of data to .json!`
        });
        return;
    }

    addSemanticsToJSONFile(path);

    res.setHeader("Content-Type","text/json");
    res.setHeader("Content-Disposition", "attachment; filename=or_instructions.json");
    const fileStream:fs.ReadStream = fs.createReadStream(path);
    fileStream.pipe(res);
});

export default {
    router
};