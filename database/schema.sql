CREATE TABLE IF NOT EXISTS Countries(
  country_name TEXT(60)  PRIMARY KEY,
  country_code TEXT(4) UNIQUE,
  has_program BOOLEAN
);

CREATE TABLE  IF NOT EXISTS Programs(
  program_name TEXT PRIMARY KEY,
  country_name TEXT(60),
  program_type TEXT,
  date_established DATE,
  year_established YEAR,
  num_of_satellites INT,
  num_of_astronauts INT,
);

CREATE TABLE  IF NOT EXISTS Treaties(
  treaty_title TEXT PRIMARY KEY,
  treaty_abbreviation TEXT,
  date_created DATE,
  year_created YEAR,
);


CREATE TABLE  IF NOT EXISTS Satellites(
  satellite_id INT AUTO_INCREMENT PRIMARY KEY,
  serial_number TEXT UNIQUE,
  currently_in_orbit BOOLEAN,
  year_made DATE
);

CREATE TABLE  IF NOT EXISTS Launches(
  program_name TEXT PRIMARY KEY,
  satellite_id INT PRIMARY KEY,
  launch_location TEXT,
  launch_date DATE,
  launch_year YEAR,
  return_date DATE,
  return_year YEAR,
  CONSTRAINT fk_program
  FOREIGN KEY (program_name)
  REFERENCES Programs(program_name),
  CONSTRAINT fk_satellite
  FOREIGN KEY (satellite_id)
  REFERENCES Satellites(satellite_id)
);


CREATE TABLE  IF NOT EXISTS Signatures(
  treaty_title TEXT PRIMARY KEY,
  country_name TEXT(60) PRIMARY KEY,
  signed_date DATE,
  signed_year YEAR,
  bound_date DATE,
  bound_year YEAR,
  CONSTRAINT fk_treaty
  FOREIGN KEY (treaty_title)
  REFERENCES Treaties(treaty_title),
  CONSTRAINT fk_country
  FOREIGN KEY (country_name)
  REFERENCES Countries(country_name)
);
