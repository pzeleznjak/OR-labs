# School Instructions Data Set

This data set stores information about school instructions given to children. It includes data on addresses, contacts, parent and child information, instruction hours and hourly rates, appointments, and instruction locations.

All data in this data set is made up for the purposes of "Open Computing" class of Computer Science study at Faculty of Electrical Engineering and Computer Science in Zagreb, Croatia

## License

School Instructions Dataset by Petar Železnjak is marked with CC0 1.0 Universal license.

Excerpt from https://chooser-beta.creativecommons.org/:

"By marking the work with a CC0 public domain dedication, the creator is giving up their copyright and allowing reusers to distribute, remix, adapt, and build upon the material in any medium or format, even for commercial purposes."

- Author: Petar Železnjak
- Version: 2.0
- Language: English

## Attributes

The data set includes the following attributes:

- `instructions_id`: Unique instructions identifier
  - Data type: Integer
- `country_name`: Name of the country where instructions are given (part of address)
  - Data type: Character array of length 50
- `place`: Name of the place where instructions are given (part of address) - city, town, village, etc.
  - Data type: Character array of length 50
- `street`: Name of the street where instructions are given (part of address)
  - Data type: Character array of length 50
- `house_number`: House number (part of address)
  - Data type: Character array of length 10
- `zip_code`: Zip code (part of address)
  - Data type: Character array of length 10
- `parent_first_name`: First name of the parent
  - Data type: Character array of length 50
- `parent_last_name`: Last name of the parent
  - Data type: Character array of length 50
- `area_code`: Phone number prefix (e.g., +385 for Croatia)
  - Data type: Character array of length 4
- `telephone`: Telephone number of the parent
  - Data type: Character array of length 9
- `email`: E-mail address of the parent
  - Data type: Character array of length 50
- `child_first_name`: First name of the child
  - Data type: Character array of length 50
- `child_last_name`: Last name of the child
  - Data type: Character array of length 50
- `school`: Name of the school the child attends
  - Data type: Character array of length 50
- `class`: Number of the school class the child is currently in
  - Data type: Integer
- `appointment`: Date and time of the appointment
  - Data type: Timestamp (date + time)
- `number_of_hours`: Number of hours the appointment lasts
  - Data type: Integer
- `hourly_rate`: Cost per hour
  - Data type: Real number
- `subject`: Subject of instructions (e.g., mathematics)
  - Data type: Character array of length 50
- `lesson`: Lesson of the subject of instructions (e.g., geometry)
  - Data type: Character array of length 50
- `location`: Location of the instructions (two possible values: "home" or "instructors")
  - Data type: Character array of length 11

