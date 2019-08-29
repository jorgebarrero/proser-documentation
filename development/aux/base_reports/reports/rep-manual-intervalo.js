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
  
  filter.llamada_clasificacion = `AND llamada_clasificacion = "Manual"`;

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
  

    console.log('Process errors', err );
    // console.log(querySQL_cdr);
    // res.status(500).send(error_final);
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


/*************************** */


function calculate (cdr) {

  let result = {
  row: null,

  fecha_inicio: null,
  fecha_final: null,
    
  fecha_inicio: null,
  fecha_final: null,
  llamadas_realizadas: null,
  llamadas_fallidas: null,
  llamadas_contestadas: null,
  llamadas_efectivas: null,
  llamadas_colgadas: null,
  
  contactabilidad: null,
  efectividad: null,
  
  seg_operacion_realizadas: null,
  t_llamadas_realizadas: null,
  
  tmo_saliente: null,
  
  };
  

  if (cdr) {
  // console.log('cdr', cdr);
  
  let row = cdr.row;

  let fecha_inicio = dates.dateToText(cdr.fecha_inicio);
  let fecha_final = dates.dateToText(cdr.fecha_final);

  let minutes = cdr.minutes;
  
  let llamadas_realizadas = cdr.llamadas_realizadas;
  let llamadas_fallidas = cdr.llamadas_fallidas;
  let llamadas_contestadas = cdr.llamadas_contestadas;
  let llamadas_efectivas = cdr.llamadas_efectivas;
  let llamadas_colgadas = cdr.llamadas_colgadas;
  
  let nivel_de_contactabilidad =
  llamadas_contestadas ? (llamadas_contestadas/llamadas_realizadas).toFixed(2) : '';;

  let nivel_de_efectividad =
  llamadas_efectivas ? (llamadas_efectivas/llamadas_realizadas).toFixed(2) : '';;
  
  let seg_operacion_realizadas = cdr.seg_tiempo_de_operacion_realizadas;
  let t_llamadas_realizadas = time.secToTime(seg_operacion_realizadas);
  
  let tmo_saliente =
  seg_operacion_realizadas? (seg_operacion_realizadas / llamadas_contestadas).toFixed(0) : '';

  result = {
  

    row,

    fecha_inicio,
    fecha_final,
    
    minutes,
    llamadas_realizadas,
    llamadas_fallidas,
    llamadas_contestadas,
    llamadas_efectivas,
    llamadas_colgadas,
    
    nivel_de_contactabilidad,
    nivel_de_efectividad,
    
    seg_operacion_realizadas,
    t_llamadas_realizadas,
    
   tmo_saliente,
  }
  
}
  
  
  return result
  }




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


function match_all( minutes, audit){
let newResult = {};

if (minutes && audit ) {
let temp = audit
.selection( x => {
  return x.minutes === minutes;
})

newResult = temp;
}
return newResult;
}





// module.exports = router;
export default router;
