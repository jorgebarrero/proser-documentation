/*
* OPERATIVO DETALLADO
*
*/

// Dependencias
import express from 'express';
import bodyParser from 'body-parser';
// import _ from 'lodash';
import myPool from './../../connections/pool';
import dates from './../../functions/dates';
import fields from './../../functions/fields';
import time from './../../functions/time';
import { SelectionConfig } from '../../models/selection';

const router = express.Router();

const poolDat = myPool.poolDat;


router.use(bodyParser.json());



/************************************************************************************** */
// READ REPORT VARIABLES FOR INDIVIDUAL DATE
router.post('/list', async (req, res, next) => {

  let selection = new SelectionConfig;
  let filter = new SelectionConfig;
  let filter_like = new SelectionConfig;
  selection = (req.body);
  let ok = true;


  let result_cdr = [];
  let result_audit = [];
  let result_auxiliares = [];
  let result_asignaciones = [];
  let result_series = [];
  let result_calculos = [];
  
  let error_cdr;
  let error_audit;
  let error_auxiliares;
  let error_asignaciones;
  let error_series;
  let error_calc;
  

  let result_join =[];
  let result_calc =[];
  let result_final =[];

  let today = dates.dateToText( new Date());

  // console.log('DATA',
  //   selection.hora_inicio.value,
  //   selection.hora_final.value,
  //   selection.minutos_intervalo.value
  // );
  

  // Preparation

  let tabla_cdr = fields.tableCdrFilter(selection.fecha_inicio); // a_clasif_cdr, a_hist_cdr_clasif
  let tabla_audit = fields.tableAuditFilter(selection.fecha_inicio); /// a_clasif_audit, a_clasif_audit_hist
  let tabla_personas = `a_clasif_personas`;  // a_clasif_personas, a_clasif_personas_hist
  
  filter.minutos_intervalo = ( selection.minutos_intervalo.value ?  selection.minutos_intervalo.value : 30);  // { 'id': 30, 'name': '30 min', 'value': 30 }
  
  filter.llamada_clasificacion = ``;

  filter.desde = fields.fieldOneFilter( 'fecha', '>=', selection.desde );  // full time
  filter.hasta = fields.fieldOneFilter( 'fecha', '<=', selection.hasta );  // full time

  filter.hora_inicio = 'AND 1';  // formato hh:mm:ss
  filter.hora_final = 'AND 1';  // formato hh:mm:ss


  filter.colas = fields.fieldMultipleFilter( selection.colas, 'numero_colas', 'id' );
  filter.clientes = fields.fieldMultipleFilter( selection.clientes, 'id_inv_clientes', 'id' );
  filter.campanas = fields.fieldMultipleFilter( selection.campanas, 'id_inv_campanas', 'id' );
  filter.servicios = fields.fieldMultipleFilter( selection.servicio, 'id_inv_servicio', 'id' );

  filter.supervisores = fields.fieldMultipleFilter( selection.supervisores, 'id_inv_supervisores', 'id' );
  filter.suplentes = fields.fieldMultipleFilter( selection.suplentes, 'id_inv_suplentes', 'id' );
  filter.agentes = fields.fieldMultipleFilter( selection.agentes, 'id_inv_agentes', 'id' );
  filter.horarios = fields.fieldMultipleFilter( selection.horarios, 'id_inv_horarios', 'id' );

  filter.group = 'GROUP BY id_inv_agentes';

  // FILTROS PARA AUDIT
  filter_like.colas = fields.fieldMultipleFilterLike( selection.colas, 'numero_colas', 'id' );
  filter_like.clientes = fields.fieldMultipleFilterLike( selection.clientes, 'id_inv_clientes', 'id' );
  filter_like.campanas = fields.fieldMultipleFilterLike( selection.campanas, 'id_inv_campanas', 'id' );
  filter_like.servicios = fields.fieldMultipleFilterLike( selection.servicio, 'id_inv_servicio', 'id' );

  filter_like.supervisores = fields.fieldMultipleFilterLike( selection.supervisores, 'id_inv_supervisores', 'id' );
  filter_like.suplentes = fields.fieldMultipleFilterLike( selection.suplentes, 'id_inv_suplentes', 'id' );
  filter_like.agentes = fields.fieldMultipleFilterLike( selection.agentes, 'id_inv_agentes', 'id' );
  filter_like.horarios = fields.fieldMultipleFilterLike( selection.horarios, 'id_inv_horarios', 'id' );
  
  filter_like.desde = fields.fieldOneFilter( 'fecha', '>=', selection.desde );  // full time
  filter_like.hasta = ''; //fields.fieldOneFilter( 'fecha', '<=', selection.hasta );  // full time

/*********************************************
 * CDR
 * ***************************************** */


    let querySQL_cdr =
      `
      SELECT

      'TOTAL' as row,

      COUNT(id_global) as registros,
      MIN(fecha) AS fecha_inicio,
      MAX(fecha) AS fecha_final,

      date_text,

      'TOTAL' as cliente,
      COUNT(DISTINCT id_inv_clientes) as numero_clientes,

      'TOTAL' AS supervisor,
      'TOTAL' as id_inv_agentes,

      'TOTAL' AS agente,
      'TOTAL' AS cedula,
      'TOTAL' AS numero_interno,

      sum(llamadas_recibidas) AS llamadas_recibidas,
      SUM( IF( llamadas_recibidas = 1, tiempo_de_operacion, 0 ) ) AS seg_recibidas,

      SEC_TO_TIME(SUM( IF( llamadas_recibidas = 1, tiempo_de_operacion, 0 ) )) AS t_recibidas,

      TIME_FORMAT(SEC_TO_TIME((SUM( IF( llamadas_recibidas = 1, tiempo_de_operacion, 0 ) )
      /
      sum(llamadas_recibidas))), ('%H:%i:%s')) as t_promedio_recibidas,



      sum(llamadas_realizadas) AS llamadas_realizadas,
      SUM( IF( llamadas_realizadas = 1, tiempo_de_operacion, 0 ))  AS seg_realizadas,

      SEC_TO_TIME(SUM( IF( llamadas_realizadas = 1, tiempo_de_operacion, 0 ) )) AS t_realizadas,

      TIME_FORMAT(SEC_TO_TIME(( SUM( IF( llamadas_realizadas = 1, tiempo_de_operacion, 0 ))
        /
        sum(llamadas_realizadas) )), ('%H:%i:%s')) AS t_promedio_realizadas,

      sum( colgado_agente ) as colgado_agente,

      sum( llamada_interna ) as llamada_interna,
      SUM( IF( llamada_interna = 1, tiempo_de_operacion, 0 ) ) AS t_internas,

      'x' AS not_ready,
      'x' AS t_not_ready,

      'x' AS on_hold,
      'x' AS t_on_hold

      FROM
      ${tabla_cdr}
  
    WHERE id_inv_agentes > 0
  
  
    ${ filter.llamada_clasificacion}
  
    ${ filter.desde }
    ${ filter.hasta }
  
    ${ filter.hora_inicio }
    ${ filter.hora_final }
  
  
    ${ filter.colas }
    ${ filter.clientes }
    ${ filter.campanas }
    ${ filter.servicios }
  
    ${ filter.supervisores }
    ${ filter.suplentes }
    ${ filter.agentes }
    ${ filter.horarios }
  

    UNION

    SELECT

      'DETAIL' as row,

      COUNT(id_global) as registros,
      MIN(fecha) AS fecha_inicio,
      MAX(fecha) AS fecha_final,

      date_text,

      nombre_clientes as cliente,
      COUNT(DISTINCT id_inv_clientes) as numero_clientes,

      nombre_supervisores AS supervisor,
      id_inv_agentes,

      nombre_agentes AS agente,
      doc_ident_agentes AS cedula,
      doc_complementario_agentes AS numero_interno,

      sum(llamadas_recibidas) AS llamadas_recibidas,
      SUM( IF( llamadas_recibidas = 1, tiempo_de_operacion, 0 ) ) AS seg_recibidas,

      SEC_TO_TIME(SUM( IF( llamadas_recibidas = 1, tiempo_de_operacion, 0 ) )) AS t_recibidas,

      TIME_FORMAT(SEC_TO_TIME((SUM( IF( llamadas_recibidas = 1, tiempo_de_operacion, 0 ) )
      /
      sum(llamadas_recibidas))), ('%H:%i:%s')) as t_promedio_recibidas,



      sum(llamadas_realizadas) AS llamadas_realizadas,
      SUM( IF( llamadas_realizadas = 1, tiempo_de_operacion, 0 ))  AS seg_realizadas,

      SEC_TO_TIME(SUM( IF( llamadas_realizadas = 1, tiempo_de_operacion, 0 ) )) AS t_realizadas,

      TIME_FORMAT(SEC_TO_TIME(( SUM( IF( llamadas_realizadas = 1, tiempo_de_operacion, 0 ))
        /
        sum(llamadas_realizadas) )), ('%H:%i:%s')) AS t_promedio_realizadas,



      sum( colgado_agente ) as colgado_agente,

      sum( llamada_interna ) as llamada_interna,
      SUM( IF( llamada_interna = 1, tiempo_de_operacion, 0 ) ) AS t_internas,

      'x' AS not_ready,
      'x' AS t_not_ready,

      'x' AS on_hold,
      'x' AS t_on_hold

      FROM
      ${tabla_cdr}
  
    WHERE id_inv_agentes > 0
  
  
    ${ filter.llamada_clasificacion}
  
    ${ filter.desde }
    ${ filter.hasta }
  
    ${ filter.hora_inicio }
    ${ filter.hora_final }
  
  
    ${ filter.colas }
    ${ filter.clientes }
    ${ filter.campanas }
    ${ filter.servicios }
  
    ${ filter.supervisores }
    ${ filter.suplentes }
    ${ filter.agentes }
    ${ filter.horarios }
  
  
    ${ filter.group }
  
        `;
  
  
  // Data base access
  try {
    var result = await poolDat.query(querySQL_cdr);
    result_cdr = result;
  
    console.log(querySQL_cdr);
  
    ok = true;
  
  }
  catch(err) {
  
  console.log('Server error querySQL_cdr');
  console.log(querySQL_cdr);
  
  ok = false;
  
  error_cdr = {
    status: 500,
    origin: `CDR`,
    query: querySQL_cdr,
    error: err
  };
  }



  let querySQL_audit =
  `
  SELECT

  'TOTAL' as row,

    MIN(fecha) AS fecha_inicio,
    MAX(fecha) AS fecha_final,

    'TOTAL'  AS supervisor,
    'TOTAL' as id_inv_agentes,

    'TOTAL'  AS agente,
    date_text,


    SUM(tiempo_sesiones) AS seg_sesionado,
    SEC_TO_TIME ( SUM(tiempo_sesiones)) AS t_sesionado,

    SUM(tiempo_conexiones) AS seg_conectado,
    SEC_TO_TIME ( SUM(tiempo_conexiones)) AS t_conectado,


    SUM(tiempo_auxiliares) AS seg_auxiliares,
    SEC_TO_TIME ( SUM(tiempo_auxiliares) ) AS t_auxiliares,

    SUM(tiempo_asignaciones) AS seg_asignaciones,
    SEC_TO_TIME ( SUM(tiempo_asignaciones) ) AS t_asignaciones,


    'x' AS t_ocupado

    FROM
    ${tabla_audit}
  
  WHERE id_inv_agentes > 0
  
  
  ${ filter.desde }
  ${ filter.hasta }
  
  ${ filter.hora_inicio }
  ${ filter.hora_final }
  
  
  ${ filter_like.colas }
  ${ filter_like.clientes }
  ${ filter_like.campanas }
  ${ filter_like.servicios }
  
  ${ filter.supervisores }
  ${ filter.suplentes }
  ${ filter.agentes }
  ${ filter.horarios }

  

  UNION

  SELECT

  'DETAIL' as row,

    MIN(fecha) AS fecha_inicio,
    MAX(fecha) AS fecha_final,

    nombre_supervisores AS supervisor,
    CONVERT(id_inv_agentes,char) as id_inv_agentes,

    nombre_agentes AS agente,
    date_text,


    SUM(tiempo_sesiones) AS seg_sesionado,
    SEC_TO_TIME ( SUM(tiempo_sesiones)) AS t_sesionado,

    SUM(tiempo_conexiones) AS seg_conectado,
    SEC_TO_TIME ( SUM(tiempo_conexiones)) AS t_conectado,


    SUM(tiempo_auxiliares) AS seg_auxiliares,
    SEC_TO_TIME ( SUM(tiempo_auxiliares) ) AS t_auxiliares,

    SUM(tiempo_asignaciones) AS seg_asignaciones,
    SEC_TO_TIME ( SUM(tiempo_asignaciones) ) AS t_asignaciones,


    'x' AS t_ocupado

    FROM
    ${tabla_audit}
  
  WHERE id_inv_agentes > 0
  
  
  ${ filter.desde }
  ${ filter.hasta }
  
  ${ filter.hora_inicio }
  ${ filter.hora_final }
  
  
  ${ filter_like.colas }
  ${ filter_like.clientes }
  ${ filter_like.campanas }
  ${ filter_like.servicios }
  
  ${ filter.supervisores }
  ${ filter.suplentes }
  ${ filter.agentes }
  ${ filter.horarios }

  
  ${ filter.group }
  


  `;


// Data base access
try {
  var result = await poolDat.query(querySQL_audit);
  result_audit = result;

   console.log(querySQL_audit);

  }
catch(err) {

  console.log('Server error querySQL_audit');
  console.log(querySQL_audit);

  ok = false;

  error_audit = {
  status: 500,
  origin: `AUDIT`,
  query: querySQL_audit,
  error: err
};
}


/************************************* */

let intervalo_serie = dates.createDateIntervals (
  selection.desde,
  selection.hasta,
);

/*********************************************
 * JOINS
 * ***************************************** */
try {

  result_join = result_cdr
  .map( x => {
    return {
      cdr: x,
      audit: matchAgent( x.id_inv_agentes, result_audit),
    }
  })


  result_calc = result_join
  .map( x => {
    return  {
      cdr: x.cdr,
      audit: x.audit,
      calc: calculate( x.cdr, x.audit)
    }
  })

  // res.send(JSON.stringify(result_calc));
}
catch(err) {

console.log('Server error CALC');

ok = false;

error_calc= {
status: 500,
origin: `CALC`,
query: `no query`,
error: err
};

}

/*********************************************
* SEND
* ***************************************** */


try {

// let result_final = {
//     result_cdr,
//     result_audit,
//     result_auxiliares,
//     result_asignaciones,
//     result_series,
//     result_calculos,
//   }

 res.send(JSON.stringify(result_calc));
}
catch(err) {

let error_final = {
  error_cdr,
  error_audit,
  error_auxiliares,
  error_asignaciones,
  error_series,
  error_calc,
}

console.log('Server error Sending');
res.status(500).send(error_final);

}


/*********************************************
* FUNCTIONS
* ***************************************** */


/******************************************************************* */

result_final = {
  result_cdr,
  result_audit
}


function matchAgent( id_inv_agentes, audit){
  let newResult = {};

  if (id_inv_agentes && audit ) {
    let temp = audit
    .filter( x => {
      return x.id_inv_agentes === id_inv_agentes;
    })

    newResult = temp[0];
  }
  return newResult;
}


function matchDate( item, data){
  let newResult = {};

  if (item && data ) {
    let temp = data
    .filter( x => {
      return x.fecha === item ;
    })

    newResult = temp[0];
  }
  return newResult;
}





function calculate (cdr, audit) {

  let result = {

    row: null,

    seg_sesion: null,
    seg_conexion: null,
    seg_auxiliar: null,
    seg_asignacion: null,

    seg_recibidas: null,
    seg_realizadas: null,


    seg_ocupacion_cdr: null,
    seg_ocupacion_audit: null,

    seg_disponible_cdr: null,
    seg_disponible_audit: null,


    t_sesion: null,
    t_conexion: null,
    t_auxiliar: null,
    t_asignacion: null,

    t_recibidas: null,
    t_realizadas: null,


    t_ocupacion_cdr: null,
    t_ocupacion_audit: null,

    t_disponible_cdr: null,
    t_disponible_audit: null,

    porc_conexion: null,
    porc_auxiliar: null,

    porc_ocupacion_cdr: null,
    porc_ocupacion_audit: null,

    porc_disponible_cdr: null,
    porc_disponible_audit: null,

    porc_llamadas_asignacion: null,

    porc_ocupacion: null,
    porc_disponible: null,
  }

if( cdr && audit ) {

  let row = cdr.id_inv_agentes; // audit.seg_sesionado;
  let seg_sesion = 1; // audit.seg_sesionado;
  let seg_conexion = audit.seg_conectado;
  let seg_auxiliar = audit.seg_auxiliares;
  let seg_asignacion = audit.seg_asignaciones;
  
  let seg_recibidas = cdr.seg_recibidas;
  let seg_realizadas = cdr.seg_realizadas;

  
  let seg_ocupacion_cdr = cdr.seg_recibidas + cdr.seg_realizadas;
  let seg_ocupacion_audit = audit.seg_asignaciones;
  
  let seg_disponible_cdr = seg_conexion - seg_ocupacion_cdr - seg_auxiliar;
  let seg_disponible_audit = seg_conexion - seg_ocupacion_audit - seg_auxiliar;


  let t_sesion = time.secToTime(seg_sesion);
  let t_conexion = time.secToTime(seg_conexion);
  let t_auxiliar = time.secToTime(seg_auxiliar);
  let t_asignacion = time.secToTime(seg_asignacion);

  let t_recibidas = time.secToTime(seg_recibidas);
  let t_realizadas = time.secToTime(seg_realizadas);

  let t_ocupacion_cdr = time.secToTime(seg_ocupacion_cdr);
  let t_ocupacion_audit = time.secToTime(seg_ocupacion_audit);

  let t_disponible_cdr = time.secToTime(seg_disponible_cdr);
  let t_disponible_audit = time.secToTime(seg_disponible_audit);


  let porc_conexion =
  seg_conexion ? (seg_conexion / seg_sesion ) : '';


  let porc_auxiliar =
  seg_auxiliar ? (seg_auxiliar / seg_conexion ) : '';


  let porc_ocupacion_cdr =
  seg_ocupacion_cdr ? (seg_ocupacion_cdr / seg_conexion ) : '';


  let porc_ocupacion_audit =
  seg_ocupacion_audit ? (seg_ocupacion_audit / seg_conexion ) : '';


  let porc_disponible_cdr =
  seg_disponible_cdr ? (seg_disponible_cdr / seg_conexion ) : '';


  let porc_disponible_audit =
  seg_disponible_audit ? (seg_disponible_audit / seg_conexion ) : '';

  let porc_llamadas_asignacion =
  seg_realizadas ? (seg_realizadas / seg_asignacion ) : '';

  let porc_ocupacion =
  porc_ocupacion_cdr > porc_ocupacion_audit ? porc_ocupacion_cdr : porc_ocupacion_audit ;

  let porc_disponible =
  1 - porc_ocupacion - porc_auxiliar;

    result = {
      row,

    seg_sesion,
    seg_conexion,
    seg_auxiliar,
    seg_asignacion,

    seg_recibidas,
    seg_realizadas,


    seg_ocupacion_cdr,
    seg_ocupacion_audit,

    seg_disponible_cdr,
    seg_disponible_audit,


    t_sesion,
    t_conexion,
    t_auxiliar,
    t_asignacion,

    t_recibidas,
    t_realizadas,


    t_ocupacion_cdr,
    t_ocupacion_audit,

    t_disponible_cdr,
    t_disponible_audit,

    porc_conexion,
    porc_auxiliar,

    porc_ocupacion_cdr,
    porc_ocupacion_audit,

    porc_disponible_cdr,
    porc_disponible_audit,

    porc_llamadas_asignacion,

    porc_ocupacion,
    porc_disponible,

    }
  }

  return result
}



});




module.exports = router
