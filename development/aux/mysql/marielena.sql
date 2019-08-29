select

call_entry.id, id_agent, id_queue_call_entry,

callerid, datetime_init, datetime_end, duration, status,

datetime_entry_queue, duration_wait, uniqueid,

name,
 
queue

FROM call_entry
LEFT OUTER JOIN agent
 ON id_agent = agent.id
LEFT OUTER JOIN queue_call_entry
 ON id_queue_call_entry = queue_call_entry.id
