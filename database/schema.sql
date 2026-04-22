CREATE TABLE IF NOT EXISTS Countries(
  country_name TEXT(60) PRIMARY KEY,
  country_code TEXT(4),
  has_program BOOLEAN NOT NULL,
  CONSTRAINT uc_countries_code UNIQUE(country_code)
);

CREATE TABLE  IF NOT EXISTS Programs(
  program_name TEXT PRIMARY KEY,
  country_name TEXT(60) NOT NULL,
  program_type TEXT,
  date_established DATE,
  year_established YEAR,
  num_of_satellites INT,
  num_of_astronauts INT,
  CONSTRAINT fk_programs_country FOREIGN KEY (country_name) REFERENCES Countries(country_name)
);

CREATE TABLE  IF NOT EXISTS Treaties(
  treaty_title TEXT PRIMARY KEY,
  treaty_abbreviation TEXT,
  date_created DATE,
  year_created YEAR,
  CONSTRAINT uc_treaties_abb UNIQUE(treaty_abbreviation)
);


CREATE TABLE  IF NOT EXISTS Satellites(
  satellite_id INT AUTO_INCREMENT PRIMARY KEY,
  serial_number TEXT,
  currently_in_orbit BOOLEAN,
  year_made DATE
  CONSTRAINT uc_satellites_serial UNIQUE(serial_number)
);

CREATE TABLE  IF NOT EXISTS Launches(
  program_name TEXT PRIMARY KEY,
  satellite_id INT PRIMARY KEY,
  launch_location TEXT,
  launch_date DATE,
  launch_year YEAR,
  return_date DATE,
  return_year YEAR,
  CONSTRAINT fk_launches_program FOREIGN KEY (program_name) REFERENCES Programs(program_name),
  CONSTRAINT fk_launches_satellite FOREIGN KEY (satellite_id) REFERENCES Satellites(satellite_id)
);


CREATE TABLE  IF NOT EXISTS Signatures(
  treaty_title TEXT PRIMARY KEY,
  country_name TEXT(60) PRIMARY KEY,
  signed_date DATE,
  signed_year YEAR,
  bound_date DATE,
  bound_year YEAR,
  CONSTRAINT fk_treaty FOREIGN KEY (treaty_title) REFERENCES Treaties(treaty_title),
  CONSTRAINT fk_country FOREIGN KEY (country_name) REFERENCES Countries(country_name)
);
