import psycopg2
import os
import json
import copy
import pprint

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
        path = os.path.join(path_to_dumps, f"{table_name}.json")
        cursor.execute(f"COPY (SELECT json_agg(row_to_json({table_name}))::TEXT FROM {table_name}) TO '{path}'")
        #cursor.execute(f"COPY {table_name} TO '{path}' DELIMITER ',' CSV HEADER")
except psycopg2.Error as e:
    print("Error executing SQL query:", e)
conn.commit()
cursor.close()
conn.close()

def read_json(path, file):
    with open(os.path.join(path, file), 'r') as write_file:
        data = json.load(write_file)
    return data

# fill addresses
addresses_data = read_json(path_to_dumps, "addresses.json")
countries_data = read_json(path_to_dumps, "countries.json")
new_addresses_data = []
for address in copy.deepcopy(addresses_data):
    country_id = address["country_id"]
    address.pop("country_id")
    for country in countries_data:
        if country["country_id"] == country_id:
            address["country"] = copy.deepcopy(country)
            address["country"].pop("country_id")
    new_addresses_data.append(address)
addresses_data = new_addresses_data

# fill contacts
contact_data = read_json(path_to_dumps, "contacts.json")
new_contacts_data = []
for contact in copy.deepcopy(contact_data):
    country_id = contact["country_id"]
    contact.pop("country_id")
    for country in countries_data:
        if country["country_id"] == country_id:
            contact["country"] = copy.deepcopy(country)
            contact["country"].pop("country_id")
    new_contacts_data.append(contact)
contact_data = new_contacts_data

# fill parents
parents_data = read_json(path_to_dumps, "parents.json")
personal_informations_data = read_json(path_to_dumps, "personal_informations.json")
new_parents_data = []
for parent in copy.deepcopy(parents_data):
    personal_information_id = parent["personal_information_id"]
    parent.pop("personal_information_id")
    for personal_information in personal_informations_data:
        if personal_information["personal_information_id"] == personal_information_id:
            parent["personal_information"] = copy.deepcopy(personal_information)
            parent["personal_information"].pop("personal_information_id")
    contact_id = parent["contact_id"]
    parent.pop("contact_id")
    for contact in contact_data:
        if contact["contact_id"] == contact_id:
            parent["contact"] = copy.deepcopy(contact)
            parent["contact"].pop("contact_id")
    new_parents_data.append(parent)
parents_data = new_parents_data

# fill children
children_data = read_json(path_to_dumps, "children.json")
new_children_data = []
for child in copy.deepcopy(children_data):
    personal_information_id = child["personal_information_id"]
    child.pop("personal_information_id")
    for personal_information in personal_informations_data:
        if personal_information["personal_information_id"] == personal_information_id:
            child["personal_information"] = copy.deepcopy(personal_information)
            child["personal_information"].pop("personal_information_id")
    new_children_data.append(child)
children_data = new_children_data

# fill instructions
instructions_data = read_json(path_to_dumps, "instructions.json")
new_instructions_data = []
for instructions in copy.deepcopy(instructions_data):
    address_id = instructions["address_id"]
    instructions.pop("address_id")
    for address in addresses_data:
        if address["address_id"] == address_id:
            instructions["address"] = copy.deepcopy(address)
            instructions["address"].pop("address_id")

    parent_id = instructions["parent_id"]
    instructions.pop("parent_id")
    for parent in parents_data:
        if parent["parent_id"] == parent_id:
            instructions["parent"] = copy.deepcopy(parent)
            instructions["parent"].pop("parent_id")

    child_id = instructions["child_id"]
    instructions.pop("child_id")
    for child in children_data:
        if child["child_id"] == child_id:
            instructions["child"] = copy.deepcopy(child)
            instructions["child"].pop("child_id")

    new_instructions_data.append(instructions)
instructions_data = new_instructions_data

with open(os.path.join(path_to_dumps, "or_instructions.json"), 'w') as write_file:
    json.dump(instructions_data, write_file, indent=2)

def delete_file(path, file):
    if os.path.exists(os.path.join(path, file)):
        os.remove(os.path.join(path, file))

delete_file(path_to_dumps, "addresses.json")
delete_file(path_to_dumps, "children.json")
delete_file(path_to_dumps, "contacts.json")
delete_file(path_to_dumps, "countries.json")
delete_file(path_to_dumps, "instructions.json")
delete_file(path_to_dumps, "parents.json")
delete_file(path_to_dumps, "personal_informations.json")