/* 
Scenario 5: Find all countries that do have a program (based on the has_program variable) 
and show their programs (join with programs and countries)
*/ 

SELECT p.*
FROM Countries c
JOIN Programs p ON c.country_name = p.country_name 
WHERE c.has_program = TRUE; 


/* 
Search for satellites
Scenario 1: Show all existing satellites
*/ 

SELECT * 
FROM Satellites 
