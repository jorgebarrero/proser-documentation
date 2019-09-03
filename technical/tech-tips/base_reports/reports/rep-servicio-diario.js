/*
* SERVICIO DIARIO
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
* SERVICIO DIARIO
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
router.get('/lista/:date/:myQuery?', async (req, res, next) => {

// Preparation
    let fecha = req.params.date;

    let buscar = req.params.myQuery;
    if (typeof buscar === "undefined") {
    buscar = ' ';
      } else {
        buscar = req.params.myQuery.replace("%20", " ").replace('\"', '');
      }

    let querySQL =
      `
      SELECT

        date_text AS fecha,
        count(id) as count_id


      FROM
        hist_cdr_clasif

      WHERE
        date_text=${fecha}

      ${buscar}

      GROUP BY
      date_text

      `;


// Data base access
  try {
        var result = await poolDat.query(querySQL);

        res.send(JSON.stringify(result));
         console.log(querySQL);

      }
  catch(err) {
    console.log('Server error');
      console.log(querySQL);
    res.status(500).send('Server error');
    // throw new Error(err)
  }
});


module.exports = router
