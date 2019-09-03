-- CDR
CREATE INDEX calldate ON asteriskcdrdb.cdr (calldate);
CREATE INDEX uniqueid ON asteriskcdrdb.cdr(uniqueid);
CREATE INDEX duration ON asteriskcdrdb.cdr(duration);

-- ASTERISK
CREATE INDEX time ON asterisk.queuelog(time);
CREATE INDEX agent ON asterisk.queuelog(agent);
CREATE INDEX callid ON asterisk.queuelog(callid);

-- CALLCENTER
CREATE INDEX callerid ON call_center.call_entry(callerid);
CREATE INDEX datetime_end ON call_center.call_entry(datetime_end);
CREATE INDEX uniqueid ON call_center.call_entry(uniqueid);
