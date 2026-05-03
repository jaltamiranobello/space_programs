DELETE FROM Signatures;
DELETE FROM Treaties;
DELETE FROM Countries;


INSERT INTO Countries (country_name, country_code, has_program)
VALUES
('Algeria','DZA', 1),
('China', 'CHN', 1),
('United States of America', 'USA', 1);

-- Seeder data for Treaties
INSERT INTO Treaties(treaty_title)
VALUES
('Moon Treaty'),
('Outer Space Treaty'),
('Artemis Accords');

-- Seeder data for Signatures
INSERT INTO Signatures(treaty_title, country_name, bound_date, bound_year)
VALUES
('Outer Space Treaty', 'Algeria', '1992-01-27', 1992),
('Outer Space Treaty', 'China', '1983-12-30', 1983),
('Outer Space Treaty', 'United States of America', '1967-10-10', 1967);

-- Countries who signed given treaty
SELECT country_name FROM Signatures WHERE treaty_title = 'Moon Treaty';

-- Treaty signed by given country
SELECT t.treaty_title 
FROM Treaties t 
JOIN Signatures s ON t.treaty_title = s.treaty_title
WHERE country_name = 'China';