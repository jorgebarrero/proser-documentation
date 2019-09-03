/*
* ENTRANTE INTERVALO
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


/*
* OPERATIVO DETALLADO
* Report
*/


/* ************************************************************************************* */
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
  
  let result_final;

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
  
  filter.llamada_clasificacion = `AND llamada_clasificacion = "Entrante"`;

  filter.desde = fields.fieldOneFilter( 'fecha', '>=', selection.desde );  // full time
  filter.hasta = fields.fieldOneFilter( 'fecha', '<=', selection.hasta );  // full time


  
  filter.hora_inicio = `AND hora >= '${selection.hora_inicio.hour}'`;  // 'formato hh:mm:ss'
  filter.hora_final = `AND hora <= '${selection.hora_final.hour}'`;  // formato hh:mm:ss

  filter.hora_final_audit = `AND hora_final <= '${selection.hora_final.hour}'`;  // formato hh:mm:ss
  filter.hora_inicio_audit = `AND hora_inicio >= '${selection.hora_inicio.hour}'`;  // 'formato hh:mm:ss'

  filter.colas = fields.fieldMultipleFilter( selection.colas, 'numero_colas', 'id' );
  filter.clientes = fields.fieldMultipleFilter( selection.clientes, 'id_inv_clientes', 'id' );
  filter.campanas = fields.fieldMultipleFilter( selection.campanas, 'id_inv_campanas', 'id' );
  filter.servicios = fields.fieldMultipleFilter( selection.servicio, 'id_inv_servicio', 'id' );

  filter.supervisores = fields.fieldMultipleFilter( selection.supervisores, 'id_inv_supervisores', 'id' );
  filter.suplentes = fields.fieldMultipleFilter( selection.suplentes, 'id_inv_suplentes', 'id' );
  filter.agentes = fields.fieldMultipleFilter( selection.agentes, 'id_inv_agentes', 'id' );
  filter.horarios = fields.fieldMultipleFilter( selection.horarios, 'id_inv_horarios', 'id' );

  filter.group = 'GROUP BY minutes';

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
  

  let querySQL_cdr =
  `

  SELECT

  'TOTAL' as row,

  'TOTAL' as minutes,

  date_text,

  COUNT(id_global) as registros,
  
  MIN(fecha) AS fecha_inicio,
  MAX(fecha) AS fecha_final,

  SUM(llamadas_recibidas) AS llamadas_recibidas,
  SUM(llamadas_abandonadas) AS llamadas_abandonadas,
  SUM(llamadas_atendidas) AS llamadas_atendidas,
  SUM(llamadas_cortas) AS llamadas_cortas,
  SUM(llamadas_antes_de_20) AS llamadas_antes_de_20,
  SUM( colgado_agente ) as colgado_agente,


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


  UNION


  SELECT

  'DETAIL' as row,

  SEC_TO_TIME(TRUNCATE( (TRUNCATE( (time_to_sec(hora) / 60), 0 )/ ${filter.minutos_intervalo}), 0)
  * ${filter.minutos_intervalo} * 60
    ) as minutes,

  date_text,
  
  COUNT(id_global) as registros,
  MIN(fecha) AS fecha_inicio,
  MAX(fecha) AS fecha_final,

  SUM(llamadas_recibidas) AS llamadas_recibidas,
  SUM(llamadas_abandonadas) AS llamadas_abandonadas,
  SUM(llamadas_atendidas) AS llamadas_atendidas,
  SUM(llamadas_cortas) AS llamadas_cortas,
  SUM(llamadas_antes_de_20) AS llamadas_antes_de_20,
  SUM( colgado_agente ) as colgado_agente,


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

  //      ${filtro_group}
// Data base access
try {
    var result = await poolDat.query(querySQL_cdr);
    result_cdr = result;
    
    console.log(querySQL_cdr);
    console.log(result_cdr.length);
    ok = true;
  }
catch(err) {

  // console.log(querySQL_cdr);
  ok = false;
  error_cdr = {
    status: 500,
    origin: `cdr`,
    query: querySQL_cdr,
    error: err
  };

}



/*****************************
* AUDIT
/*************************** */

// SUM(tiempo_connections) AS seg_conectado,
// SEC_TO_TIME ( SUM(tiempo_connections)) AS t_conectado,

// SUM(tiempo_auxiliares) AS seg_auxiliares,
// SEC_TO_TIME ( SUM(tiempo_auxiliares) ) AS t_auxiliares,

// SUM(tiempo_asignaciones) AS seg_asignaciones,
// SEC_TO_TIME ( SUM(tiempo_asignaciones) ) AS t_asignaciones,

let querySQL_audit =
`
SELECT

  SEC_TO_TIME(TRUNCATE( (TRUNCATE( (time_to_sec(hora) / 60), 0 )/ ${filter.minutos_intervalo}), 0)
  * ${filter.minutos_intervalo} * 60
  ) as minutes,

  MIN(datetime_init) AS fecha_inicio,
  MAX(datetime_end) AS fecha_final,

  date_text,

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


${ filter.hora_inicio_audit }
${ filter.hora_final_audit }

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
  
    console.log('***** AUDIT ******', querySQL_audit);

}
catch(err) {
console.log('Server error querySQL_audit');
console.log(querySQL_audit);
ok = false;
error_audit = {
  status: 500,
  origin: `cdr`,
  query: querySQL_audit,
  error: err
};
// res.status(500).send('Server error');
// res.status(500).send(JSON.stringify(err));
// throw new Error(err)
}






/************************************* */

let intervalo_serie = time.createIntervals (
  selection.hora_inicio.value,
  selection.hora_final.value,
  selection.minutos_intervalo.value
);

console.log('intervalo_serie', intervalo_serie);


try {

  console.log('');
  
  if (ok) {
    
    let result_join_cdr = intervalo_serie
    .map( x => {
      return  {
        serie: x,
        cdr: match( x.minutes, result_cdr),
      }
    })
    
    let result_join_audit = result_join_cdr
    .map( x => {
      return  {
        serie: x.serie,
        cdr: x.cdr,
        audit: match( x.serie.minutes, result_audit),
      }
    })
    
    let result_join = result_join_audit
    .map( x => {
      return  {
        serie: x.serie,
        cdr: x.cdr,
        audit: x.audit,
        calc: calculate( x.cdr),
      }
    })
    
    result_final = result_join
    // result_final = result_join_cdr
  }
  
}
catch(err) {
  ok = false;
  error_calc = {
    status: 500,
    origin: `cdr`,
    query: 'Calculos funciones JS',
    error: err
  };
  

    console.log('Process errors', error_final );
    // console.log(querySQL_cdr);
    res.status(500).send(error_final);
}

/********************************* */

// error_calculos = err;
  
let error_final = {
  error_cdr,
  error_audit,
  error_auxiliares,
  error_asignaciones,
  error_series,
  error_calc,
}
  /************************************************************* */
  if (result_final && ok) {
    res.status(201).send(JSON.stringify(result_final));
    console.log(querySQL_cdr);

  } else {
    if (error_final && !ok) {
      res.status(500).send(error_final);
    }
  }



});



/***********************************************
 * FUNCTIONS
*/


function match( item, data){
  let newResult = {};

  if (item && data ) {
    let temp = data
    .filter( x => {
      return x.minutes === item;
    })

    newResult = temp[0];
  }
  return newResult;
}




function matchSerie( cdr, serie ){
let newResult = {};

if ( cdr && serie ) {
let temp = serie
.selection( x => {
  return x.minutes === minutes;
})

newResult = temp[0];
}
return newResult;
}


function match_all( date_text, audit){
let newResult = {};

if (date_text && audit ) {
let temp = audit
.selection( x => {
  return x.date_text === date_text;
})

newResult = temp;
}
return newResult;
}



function calculate (cdr) {

let result = {

row: null,

fecha_inicio: null,
fecha_final: null,

llamadas_recibidas: null,
llamadas_abandonadas: null,
llamadas_atendidas: null,
llamadas_cortas: null,
llamadas_antes_de_20: null,
colgado_agente: null,

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
asa_entrante: null,


}

if( cdr ) {

// console.log('cdr', cdr);
let row = cdr.row;

let fecha_inicio = dates.dateToText(cdr.fecha_inicio);
let fecha_final = dates.dateToText(cdr.fecha_final);

let llamadas_recibidas = cdr.llamadas_recibidas;
let llamadas_abandonadas = cdr.llamadas_abandonadas;
let llamadas_atendidas = cdr.llamadas_atendidas;
let llamadas_cortas = cdr.llamadas_cortas;
let llamadas_antes_de_20 = cdr.llamadas_antes_de_20;
let colgado_agente = cdr.colgado_agente;

let nivel_de_servicio = llamadas_antes_de_20/llamadas_recibidas;
let nivel_de_atencion = llamadas_atendidas/llamadas_recibidas;
let nivel_de_abandono = llamadas_abandonadas/llamadas_recibidas;


let seg_operacion_recibidas = cdr.seg_llamadas_recibidas;
let t_operacion_recibidas = time.secToTime(seg_operacion_recibidas);

let seg_espera_recibidas = cdr.seg_espera_recibidas;
let t_espera_recibidas = time.secToTime(seg_espera_recibidas);

let seg_min_espera_recibidas = cdr.seg_min_espera_recibidas;
let t_min_espera_recibidas = time.secToTime(seg_min_espera_recibidas);

let seg_max_espera_recibidas = cdr.seg_max_espera_recibidas;
let t_max_espera_recibidas = time.secToTime(seg_max_espera_recibidas);

let tmo_entrante = cdr.tmo_entrante;
let asa_entrante = cdr.asa_entrante;


result = {

row,

fecha_inicio,
fecha_final,
llamadas_recibidas,
llamadas_abandonadas,
llamadas_atendidas,
llamadas_cortas,
llamadas_antes_de_20,
colgado_agente,

nivel_de_servicio,
nivel_de_atencion,
nivel_de_abandono,

seg_operacion_recibidas,
t_operacion_recibidas,

seg_espera_recibidas,
t_espera_recibidas,

seg_min_espera_recibidas,
t_min_espera_recibidas,

seg_max_espera_recibidas,
t_max_espera_recibidas,

tmo_entrante,
asa_entrante,

 }
}

return result
}




// module.exports = router;
export default router;
