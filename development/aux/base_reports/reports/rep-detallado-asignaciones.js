/*
* DETALLADO ASIGNACIONES
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



/* ************************************************************************************* */
// READ REPORT VARIABLES FOR INDIVIDUAL DATE
router.post('/list', async (req, res, next) => {
  
  let selection = new SelectionConfig;
  let filter = new SelectionConfig;
  let filter_like = new SelectionConfig;
  let filter_quotes = new SelectionConfig;
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
  
  filter.llamada_clasificacion = ``;

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

  filter.group = 'GROUP BY date';

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

  
  filter_quotes.supervisores = fields.fieldMultipleFilterQuotes( selection.supervisores, 'id_inv_supervisores', 'id' );
  filter_quotes.suplentes = fields.fieldMultipleFilterQuotes( selection.suplentes, 'id_inv_suplentes', 'id' );
  filter_quotes.agentes = fields.fieldMultipleFilterQuotes( selection.agentes, 'id_inv_agentes', 'id' );
  filter_quotes.horarios = fields.fieldMultipleFilterQuotes( selection.horarios, 'id_inv_horarios', 'id' );

  let querySQL_cdr =
  `

  SELECT
  COUNT(*) as registros,
  FROM
    ${tabla_cdr}

  `;

  //      ${filtro_group}
// Data base access
try {
    // var result = await poolDat.query(querySQL_cdr);
    // result_cdr = result;
    
    // console.log(querySQL_cdr);
    // console.log(result_cdr.length);
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


let querySQL_audit =
`
SELECT


  'TOTAL' as row,

  'TOTAL' as date,

  date_text,
  day_week_number,

  COUNT(id) as registros,

  MIN(datetime_init) AS fecha_inicio,
  MAX(datetime_end) AS fecha_final,


  hora_inicio,
  hora_final,

  segundos_inicio,
  segundos_final,

  sum(diferencia_ini_fin) as seg_conexion,

  SEC_TO_TIME  (sum(diferencia_ini_fin))  as t_conexion,

  'TOTAL' as nombre_supervisores,
  'TOTAL' as id_inv_agentes,
  'TOTAL' as numero_agentes,
  'TOTAL' as nombre_agentes,
  'TOTAL' as doc_ident_agentes,
  'TOTAL' as doc_complementario_agentes,

  'TOTAL' as horarios_inicio,
  'TOTAL' as horarios_final,
  'TOTAL' as segundos_horario_inicio,
  'TOTAL' as segundos_horario_final,
  'TOTAL' as segundos_horario,
  'TOTAL' as t_horario,

  'TOTAL' as nombre_auxiliares,


  id_global

  FROM
    ${tabla_audit}

  WHERE
  id_inv_agentes > 0 and productividad = 1 and id_inv_auxiliares > 0
  

  ${ filter.desde }
  ${ filter.hasta }


  ${ filter.hora_inicio_audit }
  ${ filter.hora_final_audit }

  ${ filter_like.colas }
  ${ filter_like.clientes }
  ${ filter_like.campanas }
  ${ filter_like.servicios }

  ${ filter_quotes.supervisores }
  ${ filter_quotes.suplentes }
  ${ filter_quotes.agentes }
  ${ filter_quotes.horarios }




UNION

SELECT

  'DETAIL' as row,

  fecha as date,

  date_text,
  day_week_number,

  id,

  (datetime_init) AS fecha_inicio,
  (datetime_end) AS fecha_final,


  hora_inicio,
  hora_final,

  segundos_inicio,
  segundos_final,

  (diferencia_ini_fin) as seg_conexion,

  SEC_TO_TIME  ((diferencia_ini_fin))  as t_conexion,

  nombre_supervisores,
  id_inv_agentes,
  numero_agentes,
  nombre_agentes,
  doc_ident_agentes,
  doc_complementario_agentes,
  horarios_inicio,
  horarios_final,
  segundos_horario_inicio,
  segundos_horario_final,
  segundos_horario_final - segundos_horario_inicio as segundos_horario,
  SEC_TO_TIME(segundos_horario_final - segundos_horario_inicio) as t_horario,
  nombre_auxiliares,




  id_global

  FROM
    ${tabla_audit}

  WHERE
  id_inv_agentes > 0 and productividad = 1 and id_inv_auxiliares > 0


  ${ filter.desde }
  ${ filter.hasta }


  ${ filter.hora_inicio_audit }
  ${ filter.hora_final_audit }

  ${ filter_like.colas }
  ${ filter_like.clientes }
  ${ filter_like.campanas }
  ${ filter_like.servicios }

  ${ filter_quotes.supervisores }
  ${ filter_quotes.suplentes }
  ${ filter_quotes.agentes }
  ${ filter_quotes.horarios }



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

let intervalo_serie = dates.createDateIntervals (
  selection.desde,
  selection.hasta,
);

console.log('intervalo_serie', intervalo_serie);


try {

  console.log('');
  
  if (ok) {
    
    let result_join_cdr = intervalo_serie
    .map( x => {
      return  {
        serie: x,
        cdr: match( x.date, result_cdr),
      }
    })
    
    let result_join_audit = result_join_cdr
    .map( x => {
      return  {
        serie: x.serie,
        cdr: x.cdr,
        audit: match( x.serie.date, result_audit),
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
    
    result_final = result_audit
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
    
    hora_inicio: null,
    hora_final: null,
    
    day_week_number: null,
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
  
  let hora_inicio = cdr.hora_inicio;
  let hora_final = cdr.hora_final;
  
  let day_week_number = (new Date(cdr.fecha_inicio).getDay()) + 1;

  
  let llamadas_realizadas = cdr.llamadas_realizadas;
  let llamadas_fallidas = cdr.llamadas_fallidas;
  let llamadas_contestadas = cdr.llamadas_contestadas;
  let llamadas_efectivas = cdr.llamadas_efectivas;
  let llamadas_colgadas = cdr.llamadas_colgadas;
  
  let nivel_de_contactabilidad =
  llamadas_contestadas ? (llamadas_contestadas/llamadas_realizadas) : '';;

  let nivel_de_efectividad =
  llamadas_efectivas ? (llamadas_efectivas/llamadas_realizadas) : '';;
  
  let seg_operacion_realizadas = cdr.seg_tiempo_de_operacion_realizadas;
  let t_llamadas_realizadas = time.secToTime(seg_operacion_realizadas);
  
  let tmo_saliente =
  seg_operacion_realizadas? (seg_operacion_realizadas / llamadas_contestadas) : '';

  result = {
  
    row,

    fecha_inicio,
    fecha_final,
    
    hora_inicio,
    hora_final,
    
    day_week_number,

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
      return x.date === item;
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




function matchSerie( cdr, serie ){
let newResult = {};

if ( cdr && serie ) {
let temp = serie
.selection( x => {
  return x.fecha === fecha;
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
