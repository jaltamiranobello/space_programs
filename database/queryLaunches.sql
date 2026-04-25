-- Seeder data for Satellites
INSERT INTO Satellites (serial_number, currently_in_orbit, year_made)
VALUES
('1ABCD10', 0, 1978),
('2EFG9', 1, 2020),
('3HIJ8', 0, 1993),
('4KLM7', 1, 2025);

-- Seeder data for Launches
INSERT INTO Launches (program_name, satellite_id)
VALUES
('China Manned Space Agency', 1),
('China Manned Space Agency', 4),
('China National Space Administration', 2),
('National Aeronautics and Space Administration', 3);

-- Show all launch information by country (country_name -> user input)
SELECT *
FROM Launches
WHERE program_name IN (SELECT program_name
                        FROM Programs
                        WHERE country_name = 'China');

-- Show all launches with satellite information by country (country_name -> user input)
SELECT *
FROM Launches
INNER JOIN Satellites USING (satellite_id)
WHERE program_name IN (SELECT program_name
                        FROM Programs
                        WHERE country_name = 'China');

-- Show all launch information by program (program_name -> user input)
SELECT *
FROM Launches
WHERE program_name = 'China Manned Space Agency';

-- Show all launch with satellite information by program (program_name -> user input)
SELECT *
FROM Launches
INNER JOIN Satellites USING (satellite_id)
WHERE program_name = 'China Manned Space Agency';

-- Show all existing launches
SELECT * FROM Launches;

-- Show all existing launches with satellite information
SELECT *
FROM Launches
INNER JOIN Satellites USING (satellite_id);