
/*
Fecha
Mes
Día
Servicio
Llamadas Recibidas
Llamadas Contestadas
Llamadas Contestadas ´20
Llamadas Abandonadas
% abandono
Nivel de Atención
ASA
Minutos Atendidos
TMO
Nivel de Servicio 80/20

*/

/*
* SERVICIO INTERVALO
*
*/

const myPool = require('./../../connections/pool');

const poolDat = myPool.poolDat;
const poolCdr = myPool.poolCdr;
const poolQue = myPool.poolQue;
const poolCall = myPool.poolCall;

// const { poolDat, poolCdr, poolQue, poolCall } = require('./../connections/pool');

// Dependencias
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());


/*
* SERVICIO INTERVALO
* Report
*/


/************************************************************************************** */
// READ REPORT VARIABLES FOR INDIVIDUAL DATE
router.post('/list/', async (req, res, next) => {

  let result_cdr;
  let result_audit;
  let result_final;
  let result_join;
  let result_calc;

  // Preparation
  let values = req.body;

    let tabla_cdr = values.tabla_cdr;
    let tabla_audit = values.tabla_audit;
    let tabla_personas = values.tabla_personas;
    let tabla_agentes = values.tabla_agentes;
    let tabla_colas = values.tabla_colas;

    let filtro_fecha_inicio = values.filtro_fecha_inicio;
    let filtro_fecha_final = values.filtro_fecha_final;
    let filtro_minutos_intervalo = values.filtro_minutos_intervalo;
    let filtro_ultimos_minutos = values.filtro_ultimos_minutos;

    let filtro_sql = values.filtro_sql;
    let filtro_sql_like = values.filtro_sql_like;

    let filtro_limit = values.filtro_limit;
    let filtro_order = values.filtro_order;
    let filtro_group = values.filtro_group;

    let filtro_otro = values.filtro_otro;


      let querySQL_cdr =
        `
        SELECT
  *

        FROM
          ${tabla_cdr}

        WHERE
        id_inv_agentes > 0
        ${filtro_fecha_inicio}
        ${filtro_fecha_final}

        ${filtro_sql}

        ${filtro_otro}

        ${filtro_group}

        `;


  // Data base access
    try {
          var result = await poolDat.query(querySQL_cdr);
          result_cdr = result
          // res.send(JSON.stringify(result));
           console.log(querySQL_cdr);

        }
    catch(err) {
      console.log('Server error');
        console.log(querySQL_cdr);
      res.status(500).send('Server error');
      // throw new Error(err)
    }



    let querySQL_audit =
    `
    SELECT

    *

    FROM
      ${tabla_audit}

    WHERE
    id_inv_agentes > 0
    ${filtro_fecha_inicio}
    ${filtro_fecha_final}


    ${filtro_sql_like}

    ${filtro_otro}

    ${filtro_group}


    `;


  // Data base access
  try {
      var result = await poolDat.query(querySQL_audit);
      result_audit = result

      result_join = result_cdr
      .map( x => {
        return { cdr: x, audit: match( x.id_agente, result_audit)}
      })


       console.log(querySQL_audit);

    }
  catch(err) {
  console.log('Server error');
    console.log(querySQL_audit);
    // res.status(500).send('Server error');
    res.status(500).send(JSON.stringify(err));
  // throw new Error(err)
  }


  /******************************************************************* */


  function match( id_agente, audit){
    let newResult = {};

    if (id_agente && audit ) {
      let temp = audit
      .filter( x => {
        return x.id_agente === id_agente;
      })

      newResult = temp[0];
    }
    return newResult;
  }

res.send(JSON.stringify(result_join));

});

/************************************************************************************** */
// READ REPORT VARIABLES FOR INDIVIDUAL DATE
router.post('/lista/:date_desde/', async (req, res, next) => {

  // Preparation
      let fecha_desde = req.params.date_desde;
      let buscar = req.body;

    let querySQL =
      `
      SELECT

      date_text as date_text,
      month_name as month_name,
      day_name as day_name,
      day_number as day_number,

      sum(llamadas_recibidas) as recibidas,
      sum(llamadas_atendidas) as atendidas,
      sum(llamadas_antes_de_20) as atendidas_20,
      sum(llamadas_abandonadas) as abandonadas,

      concat( round((sum(llamadas_abandonadas)/sum(llamadas_recibidas) *100),2) , '%') as porc_abandono,
      concat(round((sum(llamadas_atendidas)/sum(llamadas_recibidas) *100),2), '%')  as nivel_atencion,
      round(sum(tiempo_cola_agente) / sum(llamadas_atendidas), 0) as asa,

      round((sum(duration)/60),2) minutos_atendidos,

      sum(duration + tiempo_after_call) as tiempo_operacion,
      round(sum(duration + tiempo_after_call) / sum(llamadas_atendidas),2) as tmo,
      concat( round(sum(llamadas_antes_de_20)/ sum(llamadas_recibidas) * 100,2), '%') as nivel_de_servicio,

      count(DISTINCT id_inv_agentes) as cantidad_agentes

      FROM
      hist_cdr_clasif

      WHERE 1




      GROUP BY date_text

      `;


 //     date_text=${fecha_desde}
//      ${buscar}
// AND
// llamadas_entantes = 1


// Data base access
try {
  var result = await poolDat.query(querySQL);

  res.send(JSON.stringify(result));
    console.log(querySQL);
    console.log(buscar);

}
catch(err) {
console.log('Server error');
console.log(querySQL);
console.log(buscar);
res.status(500).send(JSON.stringify({"error":'Server error', error: err}));

// throw new Error(err)
}
});


module.exports = router
