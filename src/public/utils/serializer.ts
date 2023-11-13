import { createObjectCsvStringifier } from 'csv-writer'
import * as fs from 'fs';

export function queryResultsToCSV(rows:any) {
    const headers = Object.keys(rows[0]);
    
    const csvStringifier = createObjectCsvStringifier({ header: headers });
    
    const headerRow = headers.join(',') + '\n';
    
    const dataRow = csvStringifier.stringifyRecords(rows);
    
    fs.writeFileSync('./data_handling/dumps/or_filtered_instructions.csv', headerRow + dataRow);
}

export function queryResultsToJSON(rows:any[]) {
    console.log(rows);

    let instructions:any[] = [];
    rows.forEach(element => {
        const instruction = {
            instructions_id: element.instructions_id,
            appointment: element.appointment,
            number_of_hours: element.number_of_hours,
            hourly_rate: element.hourly_rate,
            subject: element.subject,
            lesson: element.lesson,
            location: element.location,
            address: {
                place: element.place,
                street: element.street,
                house_number: element.house_number,
                zip_code: element.zip_code,
                country: {
                    country_name: element.country_name,
                    area_code: element.area_code
                }
            },
            parent: {
                personal_information: {
                    first_name: element.parent_first_name,
                    last_name: element.parent_last_name
                },
                contact: {
                    telephone: element.telephone,
                    email: element.email,
                    country: {
                        country_name: element.country_name,
                        area_code: element.area_code
                    }
                }
            },
            child: {
                school: element.school,
                class: element.class,
                personal_information: {
                    first_name: element.child_first_name,
                    last_name: element.child_last_name
                }
            }
        }

        instructions.push(instruction);
    });

    const jsonString = JSON.stringify(instructions, null, 4);
    fs.writeFileSync('./data_handling/dumps/or_filtered_instructions.json', jsonString);
}