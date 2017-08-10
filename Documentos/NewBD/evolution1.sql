# --- !Ups 
DROP SCHEMA IF EXISTS ghlavras_myspot;

CREATE SCHEMA ghlavras_myspot;

USE ghlavras_myspot;

#Criando tabela de quartos
CREATE TABLE ghlavras_myspot.quarto (
  idQuarto INT NOT NULL AUTO_INCREMENT,
  tipoQuarto VARCHAR(1) NOT NULL,
  sexoQuarto VARCHAR(1) NOT NULL,
  valorQuarto DOUBLE NOT NULL,
  vagaTotal INT NULL,
  desativado BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (idQuarto));

#Criando tabela de camas
CREATE TABLE ghlavras_myspot.cama (
  idCama INT NOT NULL AUTO_INCREMENT,
  idQuarto INT NOT NULL,
  situacaoCama VARCHAR(1) NOT NULL,
  PRIMARY KEY (idCama),
  INDEX fk_cama_idx (idQuarto ASC),
  CONSTRAINT fk_cama
    FOREIGN KEY (idQuarto)
    REFERENCES ghlavras_myspot.quarto (idQuarto)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

#Criando tabela de hospedes
CREATE TABLE ghlavras_myspot.hospede (
  idHospede INT NOT NULL AUTO_INCREMENT,   
  cpf VARCHAR(15) NOT NULL,
  rg VARCHAR(10) NOT NULL,
  nome VARCHAR(128) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telefone BIGINT(14) NOT NULL,
  PRIMARY KEY (idHospede),
  UNIQUE (cpf));

# --- !Downs
DROP TABLE ghlavras_myspot.cama;
DROP TABLE ghlavras_myspot.quarto;
DROP TABLE ghlavras_myspot.hospede;

DROP SCHEMA ghlavras_myspot;
