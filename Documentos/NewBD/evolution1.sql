CREATE SCHEMA ghlavras_myspot;

CREATE TABLE ghlavras_myspot.quarto (
  idQuarto INT NOT NULL AUTO_INCREMENT,
  tipoQuarto VARCHAR(1) NOT NULL,
  sexoQuarto VARCHAR(1) NOT NULL,
  valorQuarto DOUBLE NOT NULL,
  vagaTotal INT NULL,
  PRIMARY KEY (idQuarto));
