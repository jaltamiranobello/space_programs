-- COUNTRIES PRACTICE
INSERT INTO Countries (country_name, country_code, has_program)
VALUES
('Algeria','DZA', 1),
('China', 'CHN', 1),
('United States of America', 'USA', 1);

-- PROGRAMS PRACTICE
INSERT INTO Programs (program_name, country_name, program_abbreviation, num_of_satellites, num_of_astronauts)
VALUES
('Algerian Space Agency', 'Algeria', 'ASAL', 6, 0),
('China Manned Space Agency', 'China', 'CMSA', 1245, 11),
('China National Space Administration', 'China', 'CNSA', 1245, 11),
('National Aeronautics and Space Administration', 'United States of America', 'NASA', 9674, 347);

-- TREATIES PRACTICE
INSERT INTO Treaties(treaty_title)
VALUES
('Moon Treaty'),
('Outer Space Treaty'),
('Artemis Accords');

-- SIGNATURES PRACTICE 
INSERT INTO Signatures(treaty_title, country_name, bound_date, bound_year)
VALUES
('Outer Space Treaty', 'Algeria', '1992-01-27', 1992),
('Outer Space Treaty', 'China', '1983-12-30', 1983),
('Outer Space Treaty', 'United States of America', '1967-10-10', 1967);