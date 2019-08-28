mysqladmin flush-hosts -u root -p

mysqldump -u root -p proser_hmo_su > proser_hmo_su-dump.sql

## START/STOP
systemctl start mariadb
systemctl stop mariadb



## modify length varchar
ALTER TABLE MainAudit
MODIFY audit_break_name VARCHAR(100)


## comify collation of a field
utf8_spanish_ci

ALTER TABLE call_center.break
MODIFY COLUMN name(25) COLLATE 'utf8_spanish_ci';


ALTER TABLE `call_center`.`break`
CHANGE COLUMN `name` `name` VARCHAR(250) CHARACTER SET 'utf8' NOT NULL ;


## JSON search
SELECT * FROM t WHERE JSON_CONTAINS(attr, '"donut"', '$.type');
SELECT json_extract(attr, '$.type') FROM t;

## GRANT
CREATE USER maprotel IDENTIFIED BY 'M4pr0t3l';
GRANT ALL PRIVILEGES ON *.* to maprotel@'%' IDENTIFIED BY 'M4pr0t3l';
FLUSH PRIVILEGES;

## CREATE READ ONLY
CREATE USER readmaprotel IDENTIFIED BY 'M4pr0t3l';
GRANT SELECT ON *.* to readmaprotel@'%' IDENTIFIED BY 'M4pr0t3l';
FLUSH PRIVILEGES;

## GRANT FLUSH
GRANT RELOAD ON *.* to readmaprotel@'%' IDENTIFIED BY 'M4pr0t3l';


## INDEX
CREATE INDEX datetime_entry_queue ON call_entry(datetime_entry_queue);
SHOW INDEXES FROM table_name;
DROP INDEX IF EXISTS datetime_entry_queue ON call_entry


#flush
FLUSH PRIVILEGES;
FLUSH TABLES;
FLUSH HOSTS;
FLUSH LOGS;


# show users
select * from mysql.user;
select user, password, host from mysql.user;
