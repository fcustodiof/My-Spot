# --- !Ups 
DROP SCHEMA IF EXISTS ghlavras_myspot;

CREATE SCHEMA ghlavras_myspot;

USE ghlavras_myspot;

# Criando tabela de quartos
CREATE TABLE ghlavras_myspot.quarto (
  idQuarto INT NOT NULL AUTO_INCREMENT,
  tipoQuarto VARCHAR(1) NOT NULL,
  sexoQuarto VARCHAR(1) NOT NULL,
  valorQuarto DOUBLE NOT NULL,
  vagaTotal INT NULL,
  desativado BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (idQuarto));

# Criando tabela de camas
CREATE TABLE ghlavras_myspot.cama (
  idCama INT NOT NULL AUTO_INCREMENT,
  idQuarto INT NOT NULL,
  situacaoCama VARCHAR(1) NOT NULL,
  PRIMARY KEY (idCama),
  INDEX fk_cama_idx (idQuarto ASC),
  CONSTRAINT fk_cama_idQuarto
    FOREIGN KEY (idQuarto)
    REFERENCES ghlavras_myspot.quarto (idQuarto)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

# Criando tabela de hospedes
CREATE TABLE ghlavras_myspot.hospede (
  idHospede INT NOT NULL AUTO_INCREMENT,
  dataNascimento DATE NOT NULL,   
  cpf VARCHAR(15) NOT NULL,
  rg VARCHAR(10) NOT NULL,
  nome VARCHAR(128) NOT NULL,
  email VARCHAR(100),
  telefone BIGINT(14) NOT NULL,
  PRIMARY KEY (idHospede),
  UNIQUE (cpf));

  # Criando tabela de reservas para quartos privados
  # O estado da reserva é modificado pra TRUE quando o hospede fizer check-in
  #CREATE TABLE ghlavras_myspot.reservaPrivativa(
  #  idReservaPrivativa INT NOT NULL AUTO_INCREMENT,
  #  idHospede INT NOT NULL,
  #  idQuarto INT NOT NULL,
  #  estadoReserva BOOLEAN DEFAULT FALSE,
  #  dataEntrada DATE NOT NULL,
  #  dataSaida DATE NOT NULL,
  #  qntPessoas INT NOT NULL,
  #  PRIMARY KEY (idReservaPrivativa),
  #  CONSTRAINT fk_reservaPrivativa_idHospede
  #    FOREIGN KEY (idHospede)
  #    REFERENCES ghlavras_myspot.hospede (idHospede)
  #    ON DELETE CASCADE
  #    ON UPDATE CASCADE,
  #  CONSTRAINT fk_reservaPrivativa_idQuarto
  #    FOREIGN KEY (idQuarto)
  #    REFERENCES ghlavras_myspot.quarto (idQuarto)
  #    ON DELETE CASCADE
  #    ON UPDATE CASCADE);

  # Criando tabela de reservas para camas em quartos compartilhados
  # O estado da reserva é modificado pra TRUE quando o hospede fizer check-in
  #CREATE TABLE ghlavras_myspot.reservaCompartilhada(
  #  idReservaCompartilhada INT NOT NULL AUTO_INCREMENT,
  #  idHospede INT NOT NULL,
  #  idQuarto INT NOT NULL,
  #  estadoReserva BOOLEAN DEFAULT FALSE,
  #  dataEntrada DATE NOT NULL,
  #  dataSaida DATE NOT NULL,
  #  qntCamas INT NOT NULL,
  #  PRIMARY KEY (idReservaCompartilhada),
  #  CONSTRAINT fk_reservaCompartilhada_hospede
  #    FOREIGN KEY (idHospede)
  #    REFERENCES ghlavras_myspot.hospede (idHospede)
  #    ON DELETE CASCADE
  #    ON UPDATE CASCADE,
  #  CONSTRAINT fk_reservaCompartilhada_quarto
  #    FOREIGN KEY (idQuarto)
  #    REFERENCES ghlavras_myspot.quarto (idQuarto)
  #    ON DELETE CASCADE
  #    ON UPDATE CASCADE);

  # Criando tabela de reservas.
  # A quantidade representa quantidade de camas caso a reserva seja privativa
  # ou quantidade de pessoas caso a reserva seja compartilhada.
  # O estado da reserva é modificado pra TRUE quando o hospede fizer check-in.
  CREATE TABLE ghlavras_myspot.reserva(
    idReserva INT NOT NULL AUTO_INCREMENT,
    idHospede INT NOT NULL,
    idQuarto INT NOT NULL,
    estadoReserva BOOLEAN DEFAULT FALSE,
    dataEntrada DATE NOT NULL,
    dataSaida DATE NOT NULL,
    privativa BOOLEAN DEFAULT FALSE,
    quantidade INT NOT NULL,
    PRIMARY KEY (idReserva),
    CONSTRAINT fk_reserva_hospede
      FOREIGN KEY (idHospede)
      REFERENCES ghlavras_myspot.hospede (idHospede)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT fk_reserva_quarto
      FOREIGN KEY (idQuarto)
      REFERENCES ghlavras_myspot.quarto (idQuarto)
      ON DELETE CASCADE
      ON UPDATE CASCADE);

insert into quarto (tipoQuarto, sexoQuarto, valorQuarto, vagaTotal) values ('M','M',5, 4);
insert into quarto (tipoQuarto, sexoQuarto, valorQuarto, vagaTotal) values ('M','M', 200, 10);
insert into quarto (tipoQuarto, sexoQuarto, valorQuarto, vagaTotal) values ('M','M',600, 3);

insert into cama (idQuarto, situacaoCama) values (1,'O');
insert into cama (idQuarto, situacaoCama) values (1,'L');
insert into cama (idQuarto, situacaoCama) values (2,'L');
insert into cama (idQuarto, situacaoCama) values (3,'O');

insert into hospede (dataNascimento, cpf, rg, nome, email, telefone) values ('2008-05-30', '551615', '441kofok', 'Breno', 'brn753@gmail.com', 5641251);
insert into hospede (dataNascimento, cpf, rg, nome, email, telefone) values ('2005-05-30', '66666', '44451kofok', 'Breno', 'brn753@gmail.com', 5641251);

insert into reserva (idHospede, idQuarto, estadoReserva, dataEntrada, dataSaida, privativa, quantidade) values (1, 1, 0, '2017-11-30', '2017-12-10', 0, 2);


#insert into reservacompartilhada (idHospede, idQuarto, estadoReserva, dataEntrada, dataSaida, qntCamas) values (1, 1, FALSE, '2017-11-30', '2017-12-10', 3);

#insert into reservaprivativa (idHospede, idQuarto, estadoReserva, dataEntrada, dataSaida, qntPessoas) values (1, 1, FALSE, '2017-11-30', '2017-12-10', 4);

# --- !Downs
DROP TABLE ghlavras_myspot.cama;
DROP TABLE ghlavras_myspot.reserva;
#DROP TABLE ghlavras_myspot.reservaPrivativa;
#DROP TABLE ghlavras_myspot.reservaCompartilhada;
DROP TABLE ghlavras_myspot.quarto;
DROP TABLE ghlavras_myspot.hospede;

DROP SCHEMA ghlavras_myspot;
