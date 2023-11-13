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
    return "";
}

function buildSubject(searchValue: string): string {
    return `
    SELECT *
    FROM instructions_single_table
    WHERE subject LIKE '%${searchValue}%';
    `;
}

function buildLesson(searchValue: string): string {
    return `
    SELECT *
    FROM instructions_single_table
    WHERE lesson LIKE '%${searchValue}%';
    `;
}

function buildParentName(searchValue: string): string {
    let split: string[] = searchValue.split(";").map((part) => part.trim());
    let firstName = split[0];
    let lastName = split[1];

    let logicalOperator = "AND";
    if (firstName === "" || lastName === "") {
        logicalOperator = "OR";
    }

    return `
    SELECT *
    FROM instructions_single_table
    WHERE parent_first_name LIKE '%${firstName}%'
        ${logicalOperator} parent_last_name LIKE'%${lastName}%';
    `;
}

function buildChildName(searchValue: string): string {
    let split: string[] = searchValue.split(";").map((part) => part.trim());
    let firstName = split[0];
    let lastName = split[1];

    let logicalOperator = "AND";
    if (firstName === "" || lastName === "") {
        logicalOperator = "OR";
    }

    return `
    SELECT *
    FROM instructions_single_table
    WHERE child_first_name LIKE '%${firstName}%'
        ${logicalOperator} child_last_name LIKE'%${lastName}%';
    `;
}

function buildPlace(searchValue: string): string {
    return `
    SELECT *
    FROM instructions_single_table
    WHERE place LIKE '%${searchValue}%';
    `;
}

function buildSchool(searchValue: string): string {
    return `
    SELECT *
    FROM instructions_single_table
    WHERE school LIKE '%${searchValue}%';
    `;
}

function buildClass(searchValue: string): string {
    return `
    SELECT *
    FROM instructions_single_table
    WHERE class LIKE '%${searchValue}%';
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
            buildPlace(searchValue);

        case FieldValue.SCHOOL:
            buildSchool(searchValue);

        case FieldValue.CLASS:
            buildClass(searchValue);

        default:
            throw new Error(`Invalid fieldValue ${fieldValue}!`);
            
    }
}