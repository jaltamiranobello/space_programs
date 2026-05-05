-- COUNTRIES
INSERT INTO Countries (country_name, country_code, has_program)
VALUES
('Algeria', 'DZA', 1),
('China', 'CHN', 1),
('United States of America', 'USA', 1);

-- PROGRAMS
INSERT INTO Programs (program_name, country_name, program_type, program_abbreviation, num_of_satellites, num_of_astronauts)
VALUES
('Algerian Space Agency', 'Algeria', 'Both', 'ASAL', 6, 0),
('China Manned Space Agency', 'China', 'Civilian', 'CMSA', 1245, 11),
('China National Space Administration', 'China', 'Military', 'CNSA', 1245, 11),
('National Aeronautics and Space Administration', 'United States of America', 'Civilian', 'NASA', 9674, 347);

-- TREATIES
INSERT INTO Treaties(treaty_title)
VALUES
('Moon Treaty'),
('Outer Space Treaty'),
('Artemis Accords');

-- SIGNATURES
INSERT INTO Signatures(treaty_title, country_name, bound_date, bound_year)
VALUES
('Outer Space Treaty', 'Algeria', '1992-01-27', 1992),
('Outer Space Treaty', 'China', '1983-12-30', 1983),
('Outer Space Treaty', 'United States of America', '1967-10-10', 1967);

-- SATELLITES
INSERT INTO Satellites (serial_number, currently_in_orbit, year_made)
VALUES
('1ABCD10', 0, 1978),
('2EFG9', 1, 2020),
('3HIJ8', 0, 1993),
('4KLM7', 1, 2025),
('XY345', 1, 2023),
('945BC4', 1, 2020);

-- LAUNCHES
INSERT INTO Launches (program_name, satellite_id)
VALUES
('China Manned Space Agency', 1),
('China Manned Space Agency', 4),
('China National Space Administration', 2),
('National Aeronautics and Space Administration', 3),
('Algerian Space Agency', 5),
('Algerian Space Agency', 6);