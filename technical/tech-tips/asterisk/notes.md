Hola A Todos. Escribo este mensaje para todos e incluso para mi para quien quiera obtener por phpmyadmin o por algun otro metodo las llamadas de una determinada extension.

para por medio de mysql saber las llamadas recibidas o realizadas de una determinada extension seria lo siguiente:


obtener llamadas salientes de una determinada extension en asterisk por mysql

SELECT * FROM cdr
WHERE calldate >='2018-01-09 00:00:00'
AND calldate <='2018-01-09 23:59:59'
AND substring_index( channel,'-', 1)
REGEXP'^[A-Za-z0-9]+/numero_extension$'
ORDER BY `cdr`.`calldate` DESC


obtener llamadas salientes de una extension en asterisk por mysql

SELECT * FROM cdr
WHERE calldate >='2018-01-09 00:00:00'
AND calldate <='2018-01-09 23:59:59'
AND substring_index( dstchannel,'-', 1)
REGEXP'^[A-Za-z0-9]+/numero_extension$'
ORDER BY `cdr`.`calldate` DESC


/**********************************/

SELECT * FROM MainCdr
WHERE cdr_calldate >='2019-07-04 00:00:00'
AND cdr_calldate <='2019-07-04 23:59:59'
AND substring_index( cdr_channel,'-', 1)
REGEXP'^[A-Za-z0-9]+/[0-9]'
AND (cdr_lastapp = 'Dial' OR cdr_lastapp = 'Hangup')
AND cdr_dcontext <> 'Admin' AND cdr_dcontext <> 'from-internal'
ORDER BY cdr_calldate DESC

/****/

SELECT * FROM MainCdr
WHERE cdr_calldate >='2019-07-05 00:00:00'
AND cdr_calldate <='2019-07-05 23:59:59'
AND substring_index( cdr_dstchannel,'-', 1)
REGEXP'^[A-Za-z0-9]+/[0-9]'
AND cdr_lastapp = 'Queue'
ORDER BY cdr_calldate

/****************************************************/


clid
Caller ID
src
The source number (caller ID number)
dst
The call destination
dcontext
Destination context
channel
Channel name
dstchannel
Destination channel, if applicable
lastapp
The last executed application
lastdata
The arguments to the last executed application
start
Time the call started
answer
Time the call was answered
end
Time the call ended
duration
Duration of the call in seconds
billsec
Duration of the call since the call was answered (in other words, the billable duration) in seconds
disposition
Status of the call: ANSWERED, NO ANSWER, BUSY or FAILED
amaflags
The AMA[83] flags. Possible flags are DEFAULT, BILLING, DOCUMENTATION and OMIT. (Sometimes BILLING and OMIT are replaced by BILL and IGNORE, perhaps depending on the Asterisk version.)
accountcode
The alphanumeric ID of the billing account, maximum 20 characters. May be set as well as read
uniqueid
The unique ID of the channel (maximum 32 characters)
userfield
A user field for storing arbitrary information (maximum 255 characters). May be set as well as read


// Test

SELECT * FROM cdr
WHERE calldate >='2018-01-09 00:00:00'
AND calldate <='2018-01-09 23:59:59'
AND substring_index( channel,'-', 1)
REGEXP'^[A-Za-z0-9]+/258'
ORDER BY `cdr`.`calldate` DESC

SELECT * FROM cdr
WHERE calldate >='2018-01-09 00:00:00'
AND calldate <='2018-01-09 23:59:59'
AND substring_index( dstchannel,'-', 1)
REGEXP'^[A-Za-z0-9]+/258'
ORDER BY `cdr`.`calldate` DESC


IF(substring_index( channel,'-', 1) REGEXP'^[A-Za-z0-9]+/[0-9]'; 1 ; 0)

substring_index( dstchannel,'-', 1) REGEXP'^[A-Za-z0-9]+/[0+9]'
