import psycopg2
import os
import json
import csv

with open("secrets.json", 'r') as write_file:
    secrets = json.load(write_file)

db_name = "or_instructions"
db_user = "postgres"
db_password = secrets["db_password"]
db_host = "localhost"
db_port = "5432"

try:
    conn = psycopg2.connect(
        host=db_host,
        database=db_name,
        user=db_user,
        password=db_password,
        port=db_port
    )
except (Exception, psycopg2.Error) as error:
    print("Error while connecting to PostgreSQL:", error)
cursor = conn.cursor()

path_to_dumps = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dumps") 
# path_to_dumps = os.path.dirname(os.path.dirname(__file__)) 

try:
    cursor.execute("SELECT tablename FROM pg_tables WHERE schemaname = 'public'")
    table_names = [record[0] for record in cursor.fetchall()]
    for table_name in table_names:
        path = os.path.join(path_to_dumps, f"{table_name}.csv")
        cursor.execute(f"COPY {table_name} TO '{path}' DELIMITER ',' CSV HEADER")
except psycopg2.Error as e:
    print("Error executing SQL query:", e)
conn.commit()
cursor.close()
conn.close()

def read_csv(path, file):
    data = []
    with open(os.path.join(path, file), 'r') as read_file:
        csv_reader = csv.reader(read_file)
        for row in csv_reader:
            data.append(row)
    return data

# fill addresses
addresses_data = read_csv(path_to_dumps, "addresses.csv")
countries_data = read_csv(path_to_dumps, "countries.csv")
new_addresses_data = []
for address_row in addresses_data:
    new_address_row = []
    for entry in address_row: new_address_row.append(entry)
    country_id = address_row[1]
    for country_row in countries_data:
        if country_row[0] == country_id:
            new_address_row[1] = country_row[1]
    new_addresses_data.append(new_address_row)
addresses_data = new_addresses_data

# fill contacts
contacts_data = read_csv(path_to_dumps, "contacts.csv")
new_contacts_data = []
for contacts_row in contacts_data:
    new_contacts_row = []
    for entry in contacts_row: new_contacts_row.append(entry)
    country_id = contacts_row[1]
    for country_row in countries_data:
        if country_row[0] == country_id:
            new_contacts_row[1] = country_row[2]
    new_contacts_data.append(new_contacts_row)
contacts_data = new_contacts_data

# fill parents
parents_data = read_csv(path_to_dumps, "parents.csv")
personal_informations_data = read_csv(path_to_dumps, "personal_informations.csv")
new_parents_data = []
for parents_row in parents_data:
    new_parents_row = []
    for entry in parents_row: new_parents_row.append(entry)
    personal_information_id = parents_row[2]
    for personal_information_row in personal_informations_data:
        if personal_information_row[0] == personal_information_id:
            new_parents_row[1] = personal_information_row[1]
            new_parents_row.insert(2, personal_information_row[2])
    new_parents_data.append(new_parents_row)
new_parents_data[0][1] = personal_informations_data[0][1]
new_parents_data[0].insert(2, personal_informations_data[0][2])
parents_data = new_parents_data

new_parents_data = []
for parents_row in parents_data:
    new_parents_row = []
    for entry in parents_row: new_parents_row.append(entry)
    contact_id = parents_row[3]
    for contact_row in contacts_data:
        if contact_row[0] == contact_id:
            new_parents_row[3] = contact_row[1]
            new_parents_row.insert(4, contact_row[2])
            new_parents_row.insert(5, contact_row[3])
    new_parents_data.append(new_parents_row)
parents_data = new_parents_data

# fill children
children_data = read_csv(path_to_dumps, "children.csv")
new_children_data = []
for children_row in children_data:
    new_child_row = []
    for entry in children_row: new_child_row.append(entry)
    personal_information_id = children_row[1]
    for personal_information_row in personal_informations_data:
        if personal_information_row[0] == personal_information_id:
            new_child_row[1] = personal_information_row[1]
            new_child_row.insert(2, personal_information_row[2])
    new_children_data.append(new_child_row)
children_data = new_children_data

# fill instructions
instructions_data = read_csv(path_to_dumps, "instructions.csv")
new_instructions_data = []
for instructions_row in instructions_data:
    new_instructions_row = []
    for entry in instructions_row: new_instructions_row.append(entry)

    address_id = instructions_row[1]
    for address_row in addresses_data:
        if (address_row[0] == address_id):  
            new_instructions_row[1] = address_row[1]
            new_instructions_row.insert(2, address_row[2])
            new_instructions_row.insert(3, address_row[3])
            new_instructions_row.insert(4, address_row[4])
            new_instructions_row.insert(5, address_row[5])

    parent_id = instructions_row[2]
    for parents_row in parents_data:
        if (parents_row[0] == parent_id):
            new_instructions_row[6] = parents_row[1]
            new_instructions_row.insert(7, parents_row[2])
            new_instructions_row.insert(8, parents_row[3])
            new_instructions_row.insert(9, parents_row[4])
            new_instructions_row.insert(10, parents_row[5])
    
    child_id = instructions_row[3]
    for children_row in children_data:
        if children_row[0] == child_id:
            new_instructions_row[11] = children_row[1]
            new_instructions_row.insert(12, children_row[2])
            new_instructions_row.insert(13, children_row[3])
            new_instructions_row.insert(14, children_row[4])

    new_instructions_data.append(new_instructions_row)
new_instructions_data[0][6] = 'parent_' + new_instructions_data[0][6]
new_instructions_data[0][7] = 'parent_' + new_instructions_data[0][7]
new_instructions_data[0][11] = 'child_' + new_instructions_data[0][11]
new_instructions_data[0][12] = 'child_' + new_instructions_data[0][12]
instructions_data = new_instructions_data

csv_file = os.path.join(path_to_dumps, "or_instructions.csv")
with open(csv_file, 'w') as write_file:
    csv_writer = csv.writer(write_file)
    for row in instructions_data:
        csv_writer.writerow(row)

def delete_file(path, file):
    if os.path.exists(os.path.join(path, file)):
        os.remove(os.path.join(path, file))

delete_file(path_to_dumps, "addresses.csv")
delete_file(path_to_dumps, "children.csv")
delete_file(path_to_dumps, "contacts.csv")
delete_file(path_to_dumps, "countries.csv")
delete_file(path_to_dumps, "instructions.csv")
delete_file(path_to_dumps, "parents.csv")
delete_file(path_to_dumps, "personal_informations.csv")