BEGIN;

CREATE TABLE countries (
	country_id SERIAL,
	country_name VARCHAR(50),
	area_code VARCHAR(4) UNIQUE,
	
	PRIMARY KEY (country_id),
	CONSTRAINT valid_area_code CHECK (area_code ~ '^\+[2-9]\d{2}$')
);

CREATE TABLE addresses (
	address_id SERIAL,
	country_id INTEGER,
	place VARCHAR(50),
	street VARCHAR(50),
	house_number VARCHAR(10),
	zip_code VARCHAR(10),
	
	PRIMARY KEY (address_id),
	FOREIGN KEY (country_id) REFERENCES countries,
	CONSTRAINT valid_zip_code CHECK (zip_code ~ '^\d{5}(-\d{4})?$')
);

CREATE TABLE personal_informations (
	personal_information_id SERIAL,
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	
	PRIMARY KEY (personal_information_id),
	CONSTRAINT valid_first_name CHECK (first_name ~ '^[A-Za-zčćšđžČĆŠĐŽ]+$'),
	CONSTRAINT valid_last_name CHECK (last_name ~ '^[A-Za-zčćšđžČĆŠĐŽ]+$')
);

CREATE TABLE contacts (
	contact_id SERIAL,
	country_id INTEGER,
	telephone VARCHAR(9),
	email VARCHAR(50),
	
	PRIMARY KEY (contact_id),
	FOREIGN KEY (country_id) REFERENCES countries,
	CONSTRAINT valid_telephone CHECK (telephone ~ '^[0-9]+$'),
	CONSTRAINT valid_email CHECK (email ~ '^[a-zA-Z0-9.!#$%&*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')
);

CREATE TABLE parents (
	parent_id SERIAL,
	personal_information_id INTEGER,
	contact_id INTEGER,
	
	PRIMARY KEY (parent_id),
	FOREIGN KEY (personal_information_id) REFERENCES personal_informations,
	FOREIGN KEY (contact_id) REFERENCES contacts
);

CREATE TABLE children (
	child_id SERIAL,
	personal_information_id INTEGER,
	school VARCHAR(50),
	class INTEGER,
	
	PRIMARY KEY (child_id),
	FOREIGN KEY (personal_information_id) REFERENCES personal_informations,
	CONSTRAINT valid_class CHECK (class > 0 AND class < 8)
);

CREATE TABLE instructions (
	instructions_id SERIAL,
	address_id INTEGER,
	parent_id INTEGER,
	child_id INTEGER,
	appointment TIMESTAMP,
	number_of_hours INTEGER,
	hourly_rate REAL,
	subject VARCHAR(50),
	lesson VARCHAR(50),
	location VARCHAR(11),
	
	PRIMARY KEY (instructions_id),
	FOREIGN KEY (address_id) REFERENCES addresses,
	FOREIGN KEY (parent_id) REFERENCES parents,
	FOREIGN KEY (child_id) REFERENCES children,
	CONSTRAINT valid_location CHECK (location in ('home', 'instructors'))
);

COMMIT;
