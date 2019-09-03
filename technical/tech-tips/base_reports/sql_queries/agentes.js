let querySQL_cdr = `

SELECT

  COUNT(*) as registros,

  MIN(cdr.cdr_dates_calldate) AS fecha_inicio,
  MAX(cdr.cdr_dates_calldate) AS fecha_final,

  queue.hca_queue_client_id,
  queue.hca_queue_client_name,

  queue.hca_queue_id,
  queue.hca_queue_name,

  queue.hca_queue_service_id,
  queue.hca_queue_service_name,

  id_inv_campanas,
  nombre_campanas,

  id_inv_supervisores,
  nombre_supervisores AS supervisor,

  id_inv_suplentes,
  nombre_suplentes,

  id_inv_agentes as id_inv_agentes,
  nombre_agentes,
  doc_ident_agentes,
  doc_complementario_agentes,

  id_inv_horarios,
  nombre_horarios,


  COUNT(id_global) as registros,
  MIN(fecha) AS fecha_inicio,
  MAX(fecha) AS fecha_final,

  SUM(llamadas_recibidas) AS llamadas_recibidas,
  SUM(llamadas_abandonadas) AS llamadas_abandonadas,
  SUM(llamadas_atendidas) AS llamadas_atendidas,
  SUM(llamadas_cortas) AS llamadas_cortas,
  SUM(llamadas_antes_de_20) AS llamadas_antes_de_20,
  SUM( colgado_agente ) as colgado_agente,

  '${selection.hora_inicio.hour}' as hora_inicio,
  '${selection.hora_final.hour}' as hora_final,


  SUM( IF( llamadas_recibidas = 1, tiempo_de_operacion, 0 ) )
  AS seg_llamadas_recibidas,

  SUM( IF( llamadas_recibidas = 1, tiempo_espera, 0 ) )
  AS seg_espera_recibidas,

  MIN( IF( llamadas_recibidas = 1, tiempo_espera, 0 ) )
  AS seg_min_espera_recibidas,

  MAX( IF( llamadas_recibidas = 1, tiempo_espera, 0 ) )
  AS seg_max_espera_recibidas,


  ROUND((SUM( IF( llamadas_recibidas = 1, tiempo_de_operacion, 0 ) )
  /SUM(llamadas_atendidas)), 0) AS tmo_entrante,


  ROUND(
    (SUM( IF( llamadas_recibidas = 1, tiempo_espera, 0 ) )
  /SUM(llamadas_atendidas)), 0 ) AS asa_entrante,

  SUM(llamadas_realizadas) AS llamadas_realizadas,
  SUM(llamadas_fallidas) AS llamadas_fallidas,
  SUM(llamadas_contestadas) AS llamadas_contestadas,
  SUM(llamadas_efectivas) AS llamadas_efectivas,
  SUM(llamadas_colgadas) AS llamadas_colgadas,

  SUM( IF( llamadas_realizadas = 1, tiempo_de_operacion, 0 ) )
  AS seg_tiempo_de_operacion_realizadas,

  ROUND((SUM( IF( llamadas_realizadas = 1, tiempo_de_operacion, 0 ) )
  /SUM(llamadas_realizadas)), 0) AS tmo_saliente,


  id_global

  FROM

    MainCDR as cdr
    INNER JOIN HcaAgent as agent ON cdr.cdr_type_hca_agent_id = agent.hca_agent_text_key

    INNER JOIN HcaQueue as queues ON cdr.cdr_type_hca_queue_id = queue.hca_queue_text_key

  WHERE
  ${filter}

  GROUP BY
  ${groupBy}

  ORDER BY
  ${orderBy}

  LIMIT
  ${limitBy}
  `;

let querySQL_audit = `
SELECT

  id_inv_supervisores,
  nombre_supervisores AS supervisor,

  id_inv_suplentes,
  nombre_suplentes,

  id_inv_agentes as id_inv_agentes,
  nombre_agentes,
  doc_ident_agentes,
  doc_complementario_agentes,

  id_inv_horarios,
  nombre_horarios,


  MIN(datetime_init) AS fecha_inicio,
  MAX(datetime_end) AS fecha_final,

  date_text,
  fecha as date,

  SUM(tiempo_conexiones) AS seg_conectado,
  SEC_TO_TIME ( SUM(tiempo_conexiones)) AS t_conectado,

  SUM(tiempo_auxiliares) AS seg_auxiliares,
  SEC_TO_TIME ( SUM(tiempo_auxiliares) ) AS t_auxiliares,

  SUM(tiempo_asignaciones) AS seg_asignaciones,
  SEC_TO_TIME ( SUM(tiempo_asignaciones) ) AS t_asignaciones,



  id_global

FROM
  ${tabla_audit}

  WHERE
  ${filter}

  GROUP BY
  ${groupBy}

  ORDER BY
  ${orderBy}

  LIMIT
  ${limitBy}

`;

let result = {
  row: null,

  fecha_inicio: null,
  fecha_final: null,

  hora_inicio: null,
  hora_final: null,

  day_week_number: null,

  llamadas_recibidas: null,
  llamadas_abandonadas: null,
  llamadas_atendidas: null,
  llamadas_cortas: null,
  llamadas_antes_de_20: null,

  nivel_de_servicio: null,
  nivel_de_atencion: null,
  nivel_de_abandono: null,

  seg_operacion_recibidas: null,
  t_operacion_recibidas: null,

  seg_espera_recibidas: null,
  t_espera_recibidas: null,

  seg_min_espera_recibidas: null,
  t_min_espera_recibidas: null,

  seg_max_espera_recibidas: null,
  t_max_espera_recibidas: null,

  tmo_entrante: null,
  asa_entrante: null
};
