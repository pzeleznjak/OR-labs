enum FieldValue {
    WILDCARD = "wildcard",
    SUBJECT = "subject",
    LESSON = "lesson",
    PARENT_NAME = "name_of_parent",
    CHILD_NAME = "name_of_child",
    PLACE = "place",
    SCHOOL = "school",
    CLASS = "class"
}

function buildWildcard(searchValue: string): string {
    let searchValueFloat = Number.parseFloat(searchValue);    
    
    let searchValueInt = Number.parseInt(searchValue);    
        
    if (!Number.isNaN(searchValueInt)) {
        return `
        SELECT *
        FROM instructions_single_table
        WHERE number_of_hours = ${searchValueInt}
            OR class = ${searchValueInt};
        `;
    }

    if (!Number.isNaN(searchValueFloat)) {
        return `
        SELECT *
        FROM instructions_single_table
        WHERE hourly_rate = ${searchValueFloat};
        `;
    }

    return `
    SELECT *
    FROM instructions_single_table
    WHERE appointment::varchar LIKE '${searchValue}'
        OR subject LIKE '${searchValue}'
        OR lesson LIKE '${searchValue}'
        OR location LIKE '${searchValue}'
        OR place LIKE '${searchValue}'
        OR street LIKE '${searchValue}'
        OR house_number LIKE '${searchValue}'
        OR zip_code LIKE '${searchValue}'
        OR country_name LIKE '${searchValue}'
        OR parent_first_name LIKE '${searchValue}'
        OR parent_last_name LIKE '${searchValue}'
        OR telephone LIKE '${searchValue}'
        OR email LIKE '${searchValue}'
        OR area_code LIKE '${searchValue}'
        OR school LIKE '${searchValue}'
        OR child_first_name LIKE '${searchValue}'
        OR child_last_name LIKE '${searchValue}';
    `;
}

function buildSubject(searchValue: string): string {
    return `
    SELECT *
    FROM instructions_single_table
    WHERE subject LIKE '${searchValue}';
    `;
}

function buildLesson(searchValue: string): string {
    return `
    SELECT *
    FROM instructions_single_table
    WHERE lesson LIKE '${searchValue}';
    `;
}

function buildParentName(searchValue: string): string {
    let split: string[] = searchValue.split(";").map((part) => part.trim());
    let firstName = split[0];
    let lastName = split[1];

    if (firstName === "" || firstName === undefined) {
        return `
        SELECT *
        FROM instructions_single_table
        WHERE parent_last_name LIKE '${lastName}';
        `;
    }

    if (lastName === "" || lastName === undefined) {
        return `
        SELECT *
        FROM instructions_single_table
        WHERE parent_first_name LIKE '${firstName}';
        `;
    }

    return `
    SELECT *
    FROM instructions_single_table
    WHERE parent_first_name LIKE '${firstName}'
        AND parent_last_name LIKE'${lastName}';
    `;
}

function buildChildName(searchValue: string): string {
    let split: string[] = searchValue.split(";").map((part) => part.trim());
    let firstName = split[0];
    let lastName = split[1];

    if (firstName === "" || firstName === undefined) {
        return `
        SELECT *
        FROM instructions_single_table
        WHERE child_last_name LIKE '${lastName}';
        `;
    }

    if (lastName === "" || lastName === undefined) {
        return `
        SELECT *
        FROM instructions_single_table
        WHERE child_first_name LIKE '${firstName}';
        `;
    }

    return `
    SELECT *
    FROM instructions_single_table
    WHERE parent_first_name LIKE '${firstName}'
        AND parent_last_name LIKE'${lastName}';
    `;
}

function buildPlace(searchValue: string): string {
    return `
    SELECT *
    FROM instructions_single_table
    WHERE place LIKE '${searchValue}';
    `;
}

function buildSchool(searchValue: string): string {
    return `
    SELECT *
    FROM instructions_single_table
    WHERE school LIKE '${searchValue}';
    `;
}

function buildClass(searchValue: string): string {
    return `
    SELECT *
    FROM instructions_single_table
    WHERE class = ${searchValue};
    `;
}

export function queryBuilder(searchValue:string, fieldValue:FieldValue): string {
    switch (fieldValue) {
        case FieldValue.WILDCARD:
            return buildWildcard(searchValue);

        case FieldValue.SUBJECT:
            return buildSubject(searchValue);
        
        case FieldValue.LESSON:
            return buildLesson(searchValue);

        case FieldValue.PARENT_NAME:
            return buildParentName(searchValue);

        case FieldValue.CHILD_NAME:
            return buildChildName(searchValue);

        case FieldValue.PLACE:
            return buildPlace(searchValue);

        case FieldValue.SCHOOL:
            return buildSchool(searchValue);

        case FieldValue.CLASS:
            return buildClass(searchValue);

        default:
            throw new Error(`Invalid fieldValue ${fieldValue}!`);
            
    }
}