INSERT INTO countries (country_name, area_code)
VALUES ('Croatia', '+385');

INSERT INTO addresses (country_id, place, street, house_number, zip_code)
VALUES
	(1, 'Zagreb', 'Murterska ulica', '35', '10000'),
	(1, 'Zagreb', 'Vitoroška ulica', '8', '10000'),
	(1, 'Zagreb', 'Trnsko ulica', '33D', '10000');
	
INSERT INTO personal_informations (first_name, last_name)
VALUES
	('Marko', 'Horvat'),
	('Mila', 'Horvat'),
	('Ivana', 'Kovačić'),
	('Maja', 'Kovačić'),
	('Marta', 'Novak'),
	('Mario', 'Novak');
	
INSERT INTO contacts (country_id, telephone, email)
VALUES
	(1, '0982937683', 'markohorvat12@gmail.com'),
	(1, '0998366106', 'ivana.kovacic3@gmail.com'),
	(1, '0751028473', 'novakmarta11@gmail.com');
	
INSERT INTO parents (personal_information_id, contact_id)
VALUES 
	(1, 1),
	(3, 2),
	(5, 3);
	
INSERT INTO children (personal_information_id, school, class)
VALUES
	(2, 'OŠ Rapska', 4),
	(4, 'OŠ Malešnica', 7),
	(6, 'OŠ Trnsko', 2);
	
INSERT INTO instructions (address_id, parent_id, child_id, appointment, number_of_hours, hourly_rate, subject, lesson, location)
VALUES
	(1, 1, 1, '2023-11-1 15:00:00', 2, 10, 'mathematics', 'geometry', 'home'),
	(1, 1, 1, '2023-11-3 11:00:00', 3, 10, 'mathematics', 'geometry', 'home'),
	(1, 1, 1, '2023-11-5 17:00:00', 2, 10, 'mathematics', 'geometry', 'home'),
	(2, 2, 2, '2023-11-1 12:00:00', 2, 10, 'physics', 'dinamics', 'instructors'),
	(2, 2, 2, '2023-11-2 12:00:00', 3, 10, 'physics', 'dinamics', 'instructors'),
	(2, 2, 2, '2023-11-4 18:00:00', 2, 10, 'physics', 'dinamics', 'instructors'),
	(2, 2, 2, '2023-11-5 20:00:00', 1, 10, 'physics', 'dinamics', 'instructors'),
	(3, 3, 3, '2023-11-4 11:30:00', 2, 12.5, 'mathematics', 'multiplication', 'home'),
	(3, 3, 3, '2023-11-6 11:30:00', 2, 12.5, 'mathematics', 'multiplication', 'home'),
	(3, 3, 3, '2023-11-7 11:30:00', 2, 12.5, 'mathematics', 'multiplication', 'home');