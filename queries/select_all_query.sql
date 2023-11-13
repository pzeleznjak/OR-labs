CREATE VIEW instructions_single_table AS
SELECT 
	appointment, 
	number_of_hours,
	hourly_rate,
	subject,
	lesson,
	location,
	place,
	street,
	house_number,
	zip_code,
	addresses2.country_name,
	parents2.first_name AS parent_first_name,
	parents2.last_name AS parent_last_name,
	telephone,
	email,
	parents2.area_code,
	school,
	class,
	children2.first_name AS child_first_name,
	children2.last_name AS child_last_name
FROM instructions
JOIN (
	SELECT *
	FROM addresses
	NATURAL JOIN countries 
) AS addresses2 ON instructions.address_id = addresses2.address_id
JOIN (
	SELECT *
	FROM parents 
	NATURAL JOIN personal_informations
	NATURAL JOIN contacts
	NATURAL JOIN countries
) AS parents2 ON instructions.parent_id = parents2.parent_id
JOIN (
	SELECT *
	FROM children
	NATURAL JOIN personal_informations
) AS children2 ON instructions.child_id = children2.child_id;