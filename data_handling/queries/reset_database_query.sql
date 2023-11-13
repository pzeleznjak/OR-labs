BEGIN;

DELETE FROM addresses;
ALTER SEQUENCE addresses_address_id_seq RESTART WITH 1;

DELETE FROM parents;
ALTER SEQUENCE parents_parent_id_seq RESTART WITH 1;

DELETE FROM contacts;
ALTER SEQUENCE contacts_contact_id_seq RESTART WITH 1;

DELETE FROM countries;
ALTER SEQUENCE countries_country_id_seq RESTART WITH 1;

DELETE FROM children;
ALTER SEQUENCE children_child_id_seq RESTART WITH 1;

DELETE FROM personal_informations;
ALTER SEQUENCE personal_informations_personal_information_id_seq RESTART WITH 1;

DELETE FROM instructions;
ALTER SEQUENCE instructions_instructions_id_seq RESTART WITH 1;

COMMIT;