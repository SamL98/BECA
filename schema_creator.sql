create database if not exists GWAS;
use GWAS;

create table SNPs(
    id int not null auto_increment primary key,
    name tinytext,
    chr tinyint(2) unsigned,
    pos tinyint unsigned
) ENGINE=InnoDB;

create table Papers(
    id int not null auto_increment primary key,
    pubmed_id int unsigned
) ENGINE=InnoDB;

create table Associations(
    id int not null auto_increment primary key,
    name tinytext,
    size smallint unsigned,
    cohort tinytext,
    pvalue double,
    snp int not null,
    paper int not null,
    foreign key snp_id(snp) references SNPs(id),
    foreign key paper_id(paper) references Papers(id)
) ENGINE=InnoDB;