/*
* DETALLE DE LLAMADAS
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
// LIST
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
  
  let result_join_cdr = [];
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


  filter.colas = fields.fieldMultipleFilter( selection.colas, 'numero_colas', 'id' );
  filter.clientes = fields.fieldMultipleFilter( selection.clientes, 'id_inv_clientes', 'id' );
  filter.campanas = fields.fieldMultipleFilter( selection.campanas, 'id_inv_campanas', 'id' );
  filter.servicios = fields.fieldMultipleFilter( selection.servicio, 'id_inv_servicio', 'id' );

  filter.supervisores = fields.fieldMultipleFilter( selection.supervisores, 'id_inv_supervisores', 'id' );
  filter.suplentes = fields.fieldMultipleFilter( selection.suplentes, 'id_inv_suplentes', 'id' );
  filter.agentes = fields.fieldMultipleFilter( selection.agentes, 'id_inv_agentes', 'id' );
  filter.horarios = fields.fieldMultipleFilter( selection.horarios, 'id_inv_horarios', 'id' );

  filter.group = '';

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


  filter.origen_destino =
  (selection.origen_destino) ?
  `AND (src LIKE '%${selection.origen_destino}%' or dstchannel LIKE '%${selection.origen_destino}%')`
  :
  ``;
  
      let querySQL_cdr =
        `
        SELECT

        fecha,
        SEC_TO_TIME(segundo_del_dia) AS hora,
        segundo_del_dia AS seg_evento,
        llamada_clasificacion AS tipo,
        src AS origen,
        dstchannel AS destino,


        id,
        uniqueid,
        recordingfile,

        nombre_supervisores AS supervisor,

        id_inv_agentes AS id_agente,
        nombre_agentes AS agente,
        doc_ident_agentes,
        doc_complementario_agentes,

        SEC_TO_TIME(duration) AS duracion,
        SEC_TO_TIME(billsec) AS t_facturable,


        DATE_FORMAT(fecha,'%H:%i:%s') AS hora_inicio,
        DATE_FORMAT(ivroption_time,'%H:%i:%s')  AS hora_ivr,
        DATE_FORMAT(enterqueue_time,'%H:%i:%s')  AS hora_cola,
        DATE_FORMAT(connect_time,'%H:%i:%s')  AS hora_conexion,
        DATE_FORMAT(completecaller_time,'%H:%i:%s')  AS hora_fin_llamante,
        DATE_FORMAT(completeagent_time,'%H:%i:%s')  AS hora_fin_agente,
        DATE_FORMAT(abandon_time,'%H:%i:%s')  AS hora_abandono,
        DATE_FORMAT(complete_time,'%H:%i:%s')  AS hora_fin_llmada,

        tiempo_cola_agente AS asa,

        disposition,


        resultado_llamada AS status,
        colgado_agente,

        nombre_clientes,
        nombre_colas,
        numero_colas,
        nombre_horarios,
        nombre_campanas,
        nombre_servicios,

        llamadas_recibidas,
        llamadas_abandonadas,
        llamadas_atendidas,
        llamadas_cortas,
        llamadas_antes_de_20,

        llamadas_realizadas,
        llamadas_fallidas,
        llamadas_contestadas,
        llamadas_efectivas,
        llamadas_colgadas,
        resultado_llamada_saliente,

        marcador_bbdd,
        marcador_recorridas,
        marcador_faltantes,
        marcador_vuelta,



        id_global

        FROM
    ${tabla_cdr}

  WHERE 1


  ${ filter.llamada_clasificacion}

  ${ filter.desde }
  ${ filter.hasta }

  ${ filter.hora_inicio }
  ${ filter.hora_final }

  ${ filter.origen_destino }


  ${ filter.colas }
  ${ filter.clientes }
  ${ filter.campanas }
  ${ filter.servicios }

  ${ filter.supervisores }
  ${ filter.suplentes }
  ${ filter.agentes }
  ${ filter.horarios }


  ${ filter.group }

  limit 500

`;


 // Data base access
try {
  var result = await poolDat.query(querySQL_cdr);
  result_cdr = result;
  console.log('****** CDR ******');
  console.log(result_cdr.length);
  console.log(querySQL_cdr);
  // res.status(201).send(JSON.stringify(result_cdr));
  ok = true;
}
catch(err) {


ok = false;
error_cdr = {
  status: 500,
  origin: `cdr`,
  query: querySQL_cdr,
  error: err
};

// res.status(500).send(error_final);
}


/************************************************** */


try {

  console.log('');
  
  if (ok) {
    
    result_join_cdr = result_cdr
    .map( x => {
      return  {
        cdr: x,
        calc: findRecording( x.uniqueid, x.recordingfile ),
      }
    })

    result_final = result_join_cdr
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
    // console.log(querySQL_cdr);

  } else {
    if (error_final && !ok) {
      res.status(500).send(error_final);
    }
  }



});


module.exports = router


function findRecording( uniqueid, recordingfile ) {

  let result = {};

  if ( uniqueid && recordingfile ) {

    result ={  uniqueid: uniqueid, recordingfile: recordingfile.replace( /\/var\/spool\/asterisk\/monitor\//g, 'http://10.30.4.54:8080/grabaciones/') }
  }


  return result
}
