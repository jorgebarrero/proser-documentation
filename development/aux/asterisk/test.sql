SELECT

uniqueid

, IF(substring_index( clid,'-', 1) REGEXP'Login', 1 , 0) AS login

, IF(substring_index( channel,'-', 1) REGEXP'^[A-Za-z0-9]+/[0-9]', 1 , 0) AS outbound
, IF(substring_index( dstchannel,'-', 1) REGEXP'^[A-Za-z0-9]+/[0-9]', 1 , 0) AS inbound

,calldate, clid, src, dst, dcontext, channel, dstchannel, lastapp, lastdata, duration, billsec, disposition, amaflags, accountcode, uniqueid, userfield, recordingfile, cnum, cnam, outbound_cnum, outbound_cnam, dst_cnam, did, id

FROM cdr

LIMIT 100
