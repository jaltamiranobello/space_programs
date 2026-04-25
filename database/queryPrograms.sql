-- Seeder data for Countries
INSERT INTO Countries  (country_name, country_code, has_program)
VALUES
('Australia', 'AUS', 1),
('Brazil', 'BRA', 1),
('Bulgaria', 'BGR', 0),
('China', 'CHN', 1),
('Chile', 'CHL', 0);


-- Seeder data for Programs
INSERT INTO Programs (program_name, country_name, program_type, program_abbreviation, date_established, year_established, num_of_satellites, num_of_astronauts)
VALUES
('Australian Space Agency', 'Australia', 'Civilian', 'ASA', '1990-03-05', 1990, 5, 0),
('Brazilian Space Agency', 'Brazil', 'Civilian', 'AEB', '1994-05-20', 1994, 3, 0),
('China Manned Space Agency', 'China', 'Civilian', 'CMSA', '1960-02-14', 1960, 1245, 11),
('China National Space Administration', 'China', 'Civilian', 'CNSA', '1960-03-01', 1960, 1245, 11);

-- Show all program information by country (country_name -> user input)
SELECT * 
FROM Programs
WHERE country_name = 'Australia';

-- Show all existing programs
SELECT * FROM Programs;

-- Show all existing countries
SELECT * FROM Countries;

-- Show all countries that do not have a space program
SELECT * FROM Countries
WHERE has_program = 0;