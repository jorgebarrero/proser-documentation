/*
* SALIENTE DIARIO
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
  
  filter.llamada_clasificacion = `AND llamada_clasificacion = "Manual"`;

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

  filter.group = 'GROUP BY fecha';

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

      COUNT(id_global) as registros,
      MIN(fecha) AS fecha_inicio,
      MAX(fecha) AS fecha_final,

      date_text as fecha,

      SUM( tiempo_after_call ) AS seg_after_call,
      SEC_TO_TIME( tiempo_after_call ) AS t_after_call,

      SUM(llamada_productiva) AS llamada_productiva,
      SUM(	llamada_operativa) AS 	llamada_operativa,
      SUM(llamada_interna) AS llamada_interna,
      SUM(llamada_entrante) AS llamada_entrante,
      SUM(llamada_entrante_automatica) AS llamada_entrante_automatica,
      SUM(llamada_saliente_manual) AS llamada_saliente_manual,

      SUM(llamadas_recibidas) AS llamadas_recibidas,
      SUM(llamadas_abandonadas) AS llamadas_abandonadas,
      SUM(llamadas_atendidas) AS llamadas_atendidas,
      SUM(llamadas_cortas) AS llamadas_cortas,
      SUM(llamadas_antes_de_20) AS llamadas_antes_de_20,
      SUM( colgado_agente ) as colgado_agente,

      SUM(llamadas_realizadas) AS llamadas_realizadas,
      SUM(llamadas_fallidas) AS llamadas_fallidas,
      SUM(llamadas_contestadas) AS llamadas_contestadas,
      SUM(llamadas_efectivas) AS llamadas_efectivas,
      SUM(llamadas_colgadas) AS llamadas_colgadas,


      SUM(duration) AS duration,
      SUM(billsec) AS billsec,

      ROUND((SUM(llamadas_antes_de_20)/SUM(llamadas_recibidas) * 100), 2) as nivel_de_servicio,
      ROUND((SUM(llamadas_atendidas)/SUM(llamadas_recibidas) * 100), 2)  as nivel_de_atencion,
      ROUND((SUM(llamadas_abandonadas)/SUM(llamadas_recibidas) * 100), 2)  as nivel_de_abandono,



      SUM( IF( llamadas_recibidas = 1, tiempo_de_operacion, 0 ) )
      AS seg_tiempo_de_operacion_recibidas,

      SUM( IF( llamadas_realizadas = 1, tiempo_de_operacion, 0 ) )
      AS seg_tiempo_de_operacion_realizadas,

      SUM( IF( llamadas_recibidas = 1, tiempo_espera, 0 ) )
      AS seg_tiempo_espera,

      MIN( IF( llamadas_recibidas = 1, tiempo_espera, 0 ) )
      AS seg_tiempo_espera_min,

      MAX( IF( llamadas_recibidas = 1, tiempo_espera, 0 ) )
      AS seg_tiempo_espera_max,


      ROUND((SUM( IF( llamadas_recibidas = 1, tiempo_de_operacion, 0 ) )
      /SUM(llamadas_atendidas)), 0) AS tmo_entrante,

      ROUND((SUM( IF( llamadas_realizadas = 1, tiempo_de_operacion, 0 ) )
      /SUM(llamadas_realizadas)), 0) AS tmo_saliente,


      ROUND(
       (SUM( IF( llamadas_recibidas = 1, tiempo_espera, 0 ) )
      /SUM(llamadas_atendidas)), 0 ) AS asa_entrante,


      SUM( IF( llamadas_recibidas = 1, duration, 0 ) ) AS seg_recibidas,
      SEC_TO_TIME(SUM( IF( llamadas_recibidas = 1, duration, 0 ) )) AS t_recibidas,
      TIME_FORMAT(SEC_TO_TIME(
        (SUM( IF( llamadas_recibidas = 1, duration, 0 )) /
        SUM(llamadas_recibidas))),
      ('%H:%i:%s')) as t_promedio_recibidas,


      SUM(llamadas_realizadas) AS llamadas_realizadas,
      SUM( IF( llamadas_realizadas = 1, duration, 0 ))  AS seg_realizadas,
      SEC_TO_TIME(SUM( IF( llamadas_realizadas = 1, duration, 0 ) )) AS t_realizadas,
      TIME_FORMAT(SEC_TO_TIME(
        (SUM( IF( llamadas_realizadas = 1, duration, 0 )) /
        SUM(llamadas_realizadas) )),
      ('%H:%i:%s')) AS t_promedio_realizadas,

      SUM( llamada_interna ) as llamada_interna,

      SUM( IF( llamada_interna = 1, duration, 0 ) ) AS t_internas,

      id_global

      FROM
    ${tabla_cdr}

  WHERE 1


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

/*********************************************
 * AUXILAIRES
 * ***************************************** */

  let querySQL_auxiliares =
  `
  SELECT

    MIN(fecha) AS fecha_inicio,
    MAX(fecha) AS fecha_final,

    date_text as fecha,

    id_inv_auxiliares,
    nombre_auxiliares,

    SUM(tiempo_auxiliares) AS seg_auxiliares,
    SEC_TO_TIME ( SUM(tiempo_auxiliares) ) AS t_auxiliares,


    id_global

    FROM
    ${tabla_audit}
  
  WHERE 1
  
  
  ${ filter.desde }
  ${ filter.hasta }
  
  ${ filter.hora_inicio }
  ${ filter.hora_final }
  
  
  ${ filter_like.colas }
  ${ filter_like.clientes }
  ${ filter_like.campanas }
  ${ filter_like.servicios }
  
  ${ filter_like.supervisores }
  ${ filter_like.suplentes }
  ${ filter_like.agentes }
  ${ filter_like.horarios }
  
  ${ filter.group }
  

  `;


// Data base access
try {

  var result = await poolDat.query(querySQL_auxiliares);
  result_auxiliares = result

  console.log(querySQL_auxiliares);

  ok = true;

  }
catch(err) {

  console.log('Server error querySQL_auxiliares');
  console.log(querySQL_auxiliares);

  ok = false;

  error_auxiliares = {
  status: 500,
  origin: `AUXILAIRES`,
  query: querySQL_auxiliares,
  error: err
};

}


/*********************************************
 * ASIGNACIONES
 * ***************************************** */

let querySQL_asignaciones =
`
SELECT

  MIN(fecha) AS fecha_inicio,
  MAX(fecha) AS fecha_final,

  date_text as fecha,

  id_inv_auxiliares,
  nombre_auxiliares,

  SUM(tiempo_auxiliares) AS seg_auxiliares,
  SEC_TO_TIME ( SUM(tiempo_auxiliares) ) AS t_auxiliares,


  id_global

  FROM
  ${tabla_audit}

WHERE 1


${ filter.desde }
${ filter.hasta }

${ filter.hora_inicio }
${ filter.hora_final }


${ filter_like.colas }
${ filter_like.clientes }
${ filter_like.campanas }
${ filter_like.servicios }

${ filter_like.supervisores }
${ filter_like.suplentes }
${ filter_like.agentes }
${ filter_like.horarios }

${ filter.group }


`;


// Data base access
try {
  var result = await poolDat.query(querySQL_asignaciones);
  result_asignaciones = result

   console.log(querySQL_asignaciones);

   ok = true;

  }
catch(err) {

  console.log('Server error querySQL_asignaciones');
  console.log(querySQL_asignaciones);
  
  ok = false;

  error_asignaciones = {
  status: 500,
  origin: `ASIGNACIONES`,
  query: querySQL_asignaciones,
  error: err
};
  // res.status(500).send('Server error');
  // res.status(500).send(JSON.stringify(err));
// throw new Error(err)
}



/*********************************************
 * AUDIT
 * ***************************************** */

  let querySQL_audit =
  `
  SELECT

    MIN(fecha) AS fecha_inicio,
    MAX(fecha) AS fecha_final,

    date_text as fecha,

    SUM(tiempo_conexiones) AS seg_conectado,
    SEC_TO_TIME ( SUM(tiempo_conexiones)) AS t_conectado,

    SUM(tiempo_auxiliares) AS seg_auxiliares,
    SEC_TO_TIME ( SUM(tiempo_auxiliares) ) AS t_auxiliares,

    SUM(tiempo_asignaciones) AS seg_asignaciones,
    SEC_TO_TIME ( SUM(tiempo_asignaciones) ) AS t_asignaciones,


    id_global

    FROM
    ${tabla_audit}
  
  WHERE 1
  
  
  ${ filter.desde }
  ${ filter.hasta }
  
  ${ filter.hora_inicio }
  ${ filter.hora_final }
  
  
  ${ filter_like.colas }
  ${ filter_like.clientes }
  ${ filter_like.campanas }
  ${ filter_like.servicios }
  
  ${ filter_like.supervisores }
  ${ filter_like.suplentes }
  ${ filter_like.agentes }
  ${ filter_like.horarios }
  
  ${ filter.group }
  


  `;


// Data base access
try {
  var result = await poolDat.query(querySQL_audit);
  result_audit = result

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


/*********************************************
 * JOINS
 * ***************************************** */
try {

    result_join = result_cdr
    .map( x => {
      return {
        cdr: x,
        audit: match( x.fecha, result_audit),
        audit_auxiliares: match_all( x.fecha, result_auxiliares),
        audit_asignaciones: match_all (x.fecha, result_asignaciones)
      }
    })


    result_calc = result_join
    .map( x => {
      return  {
        cdr: x.cdr,
        audit: x.audit,
        audit_auxiliares: x.audit_auxiliares,
        audit_asignaciones: x.audit_asignaciones,
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

function match( fieldValue, data ){

  let result = {};

  if ( fieldValue && data ) {
    let temp = data
    .filter( x => {
      return x.fecha === fieldValue ;
    })

    result = temp[0];
  }

  return result;
}



function match_all( fecha, audit){
  let newResult = {};

  if (date_text && audit ) {
    let temp = audit
    .filter( x => {
      return x.date_text === date_text;
    })

    newResult = temp;
  }
  return newResult;
}



function calculate (cdr, audit) {

  let result = { seg_ocupado: null, seg_disponible: null, t_ocupado: null, t_disponible: null }

if( cdr && audit ) {

    let llamadas_recibidas = cdr.llamadas_recibidas;
    let llamadas_realizadas = cdr.llamadas_realizadas;

    let tiempo_conectado = audit.t_conectado;

    let tiempo_recibidas = cdr.t_recibidas;
    let tiempo_realizadas = cdr.t_realizadas;

    let tiempo_after_call = cdr.t_after_call;

    let tiempo_asignaciones = audit.t_asignaciones;

    let tiempo_auxiliares = audit.t_auxiliares;



    let seg_ocupado =
    cdr.seg_recibidas +
    cdr.seg_realizadas +
    cdr.seg_after_call +
    audit.seg_asignaciones +
    audit.seg_auxiliares
    ;

    let seg_productivos =
    cdr.seg_recibidas +
    cdr.seg_realizadas +
    cdr.seg_after_call +
    audit.seg_asignaciones
    ;

    let seg_conversacion =
    cdr.seg_recibidas +
    cdr.seg_realizadas
    ;



    let seg_auxiliares = audit.seg_auxiliares;

    let seg_disponible = audit.seg_conectado - seg_ocupado;

    let tiempo_ocupado = time.secToTime(seg_ocupado);
    let tiempo_productivo = time.secToTime(seg_productivos);
    let tiempo_disponible = time.secToTime(seg_disponible);
    let tiempo_conversacion = time.secToTime(seg_conversacion);



    let porc_ocupacion = '';
    if ( audit.seg_conectado ) {
      porc_ocupacion = parseFloat( (seg_ocupado / audit.seg_conectado) * 100 ).toFixed(2);
    }


    let porc_produccion = '';
    if ( audit.seg_conectado ) {
      porc_produccion = parseFloat( (seg_productivos / audit.seg_conectado) * 100 ).toFixed(2);
    }

    let porc_auxiliar = '';
    if ( audit.seg_conectado ) {
      porc_auxiliar = parseFloat( (seg_auxiliares / audit.seg_conectado) * 100 ).toFixed(2);
    }

    let porc_disponible = '';
    if ( audit.seg_conectado ) {
      porc_disponible = parseFloat( (seg_disponible / audit.seg_conectado) * 100 ).toFixed(2);
    }

    let porc_conversacion = '';
    if ( audit.seg_conectado ) {
      porc_disponible = parseFloat( (seg_conversacion / audit.seg_conectado) * 100 ).toFixed(2);
    }


    result = {
      llamadas_recibidas,
      llamadas_realizadas,

      tiempo_conectado,

      tiempo_recibidas,
      tiempo_realizadas,
      tiempo_conversacion,

      tiempo_asignaciones,
      tiempo_auxiliares,
      tiempo_after_call,

      tiempo_ocupado,
      tiempo_productivo,
      tiempo_disponible,


      porc_ocupacion,

      porc_produccion,
      porc_auxiliar,
      porc_disponible,
      porc_conversacion,

     }
  }

  return result
}



});


module.exports = router
