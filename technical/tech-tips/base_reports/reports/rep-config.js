/*
* CONFIGURACION
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
* Funciones de busqueda con parametros externos
*/

/************************************************************************************** */
// TEST
router.get('/one/:myQuery?', async (req, res, next) => {

// Preparation
    let buscar = req.params.myQuery;
    if (typeof buscar === "undefined") {
    buscar = ' ';
      } else {
        buscar = req.params.myQuery.replace("%20", " ").replace('\"', '');
      }

  let querySQL = `
  SELECT COUNT(id) as cantidad_configuracion
  FROM configuracion WHERE 1
  ${buscar}
  `;

// Data base access
  try {
        var result = await poolDat.query(querySQL);

        res.send(JSON.stringify(Object.values(result)));
        // console.log(result);

      }
  catch(err) {
    console.log('Server error');
    res.status(500).send(JSON.stringify({"error":'Server error'}));
    // throw new Error(err)
  }
});

/************************************************************************************** */
// AVIALABLE DATES
router.get('/dates/:myQuery?', async (req, res, next) => {

  // Preparation
      let buscar = req.params.myQuery;
      if (typeof buscar === "undefined") {
      buscar = ' ';
        } else {
          buscar = req.params.myQuery.replace("%20", " ").replace('\"', '').replace(';', 'xxx');
        }

    let querySQL = `
    SELECT

    DISTINCT date_text as dates,
    year,
    month_number,
    month_name

    FROM hist_cdr_clasif WHERE 1
    ${buscar}
    `;

  // Data base access
    try {
          var result = await poolDat.query(querySQL);

          res.send(JSON.stringify(Object.values(result)));
          // console.log(querySQL);

        }
    catch(err) {
          console.log('Server error');
          res.status(500).send(JSON.stringify({"error":'Server error'}));
          // throw new Error(err)
    }
  });

  /************************************************************************************** */
// AVIALABLE YEARS
router.get('/years/:myQuery?', async (req, res, next) => {

  // Preparation
      let buscar = req.params.myQuery;
      if (typeof buscar === "undefined") {
      buscar = ' ';
        } else {
          buscar = req.params.myQuery.replace("%20", " ").replace('\"', '').replace(';', 'xxx');
        }

    let querySQL = `
    SELECT
    DISTINCT year
    FROM hist_cdr_clasif WHERE
	year > 0

    ${buscar}
    `;

  // Data base access
    try {
          var result = await poolDat.query(querySQL);

          res.send(JSON.stringify(Object.values(result)));
          console.log(querySQL);

        }
    catch(err) {
          console.log('Server error');
          res.status(500).send(JSON.stringify({"error":'Server error'}));
          // throw new Error(err)
    }
  });

    /************************************************************************************** */
// AVIALABLE MONTHS
router.get('/months/:myQuery?', async (req, res, next) => {

  // Preparation
      let buscar = req.params.myQuery;
      if (typeof buscar === "undefined") {
      buscar = ' ';
        } else {
          buscar = req.params.myQuery.replace("%20", " ").replace('\"', '').replace(';', 'xxx');
        }

    let querySQL = `
    SELECT
    DISTINCT month_number,
	   month_name,
      year
    FROM hist_cdr_clasif WHERE
	month_number > 0
    ${buscar}
    `;

  // Data base access
    try {
          var result = await poolDat.query(querySQL);

          res.send(JSON.stringify(Object.values(result)));
          // console.log(querySQL);

        }
    catch(err) {
          console.log('Server error');
          res.status(500).send(JSON.stringify({"error":'Server error'}));
          // throw new Error(err)
    }
  });


   /************************************************************************************** */
// AVIALABLE DATA
router.get('/data_check/:date/:myQuery?', async (req, res, next) => {

  let fecha = req.params.date;

  // Preparation
      let buscar = req.params.myQuery;
      if (typeof buscar === "undefined") {
      buscar = ' ';
        } else {
          buscar = req.params.myQuery.replace("%20", " ").replace('\"', '').replace(';', 'xxx');
        }

    let querySQL = `

    SELECT

    ${fecha} as fecha,

    (SELECT day_name FROM hist_cdr_clasif WHERE date_text =  ${fecha} GROUP BY day_name ) as dia,

    (SELECT count(*) FROM hist_cdr_clasif WHERE date_text =  ${fecha}  ) as cdr,


    (SELECT count(*) FROM hist_audit_clasif  WHERE date_text =  ${fecha}  ) as audit

    `;

  // Data base access
    try {
          var result = await poolDat.query(querySQL);

          res.send(JSON.stringify(Object.values(result)));
          // console.log(querySQL);

        }
    catch(err) {
          console.log('Server error');
          res.status(500).send(JSON.stringify({"error":'Server error', error: err}));
          // throw new Error(err)
    }
  });



   /************************************************************************************** */
// AVIALABLE DATA
router.get('/global/', async (req, res, next) => {

  let fecha = req.params.date;

  // Preparation

    let querySQL = `

    SELECT count(*) FROM hist_cdr_clasif LIMIT 1

    `;

  // Data base access
    try {
          var result = await poolDat.query(querySQL);

          res.send(JSON.stringify(Object.values(result)));
          // console.log(querySQL);

        }
    catch(err) {
          console.log('Server error');
          res.status(500).send(JSON.stringify({"error":'Server error', error: err}));
          // throw new Error(err)
    }
  });

/************************************************************************************** */
// READ MENU VARIABLES FROM CDR FOR INDIVIDUAL DATE
router.get('/menu/:date/:myQuery?', async (req, res, next) => {

// Preparation
    let fecha = req.params.date;

    let buscar = req.params.myQuery;
    if (typeof buscar === "undefined") {
    buscar = ' ';
      } else {
        buscar = req.params.myQuery.replace("%20", " ").replace('\"', '');
      }

  let querySQL = `
  SELECT
    date_text as fecha,
    id_inv_agentes, nombre_reportes_agentes,
    id_inv_supervisores,  nombre_supervisores,
    numero_colas, nombre_colas,
    id_inv_clientes, nombre_clientes,
    id_inv_campanas, nombre_campanas,
    id_inv_servicios, nombre_servicios

  FROM
    hist_cdr_clasif

  WHERE
    clasificacion_llamada <> 'Sistema'
      AND
    date_text = ${fecha}

    ${buscar}
  `;

// Data base access
  try {
        var result = await poolDat.query(querySQL);

        var agent = Object.values(result)
          .map((x) => agentes = {
            id_inv_agentes: x.id_inv_agentes,
            nombre_reportes_agentes: x.nombre_reportes_agentes,
          })
          .filter((thing, index, self) =>
            index === self.findIndex((t) => (
              t.id_inv_agentes === thing.id_inv_agentes &&
              t.id_inv_agentes > 0
            ))
          )

        var supervisor = Object.values(result)
          .map((x) => supervisores = {
            id_inv_supervisores: x.id_inv_supervisores,
            nombre_supervisores: x.nombre_supervisores,
          })
          .filter((thing, index, self) =>
            index === self.findIndex((t) => (
              t.id_inv_supervisores === thing.id_inv_supervisores &&
              t.id_inv_supervisores > 0
            ))
          )

        var queue = Object.values(result)
          .map((x) => colas = {
            numero_colas: x.numero_colas,
            nombre_colas: x.nombre_colas,
          })
          .filter((thing, index, self) =>
            index === self.findIndex((t) => (
              t.numero_colas === thing.numero_colas &&
              t.numero_colas > 0
            ))
          )

        var client = Object.values(result)
          .map((x) => clientes = {
            id_inv_clientes: x.id_inv_clientes,
            nombre_clientes: x.nombre_clientes,
          })
          .filter((thing, index, self) =>
            index === self.findIndex((t) => (
              t.id_inv_clientes === thing.id_inv_clientes &&
              t.id_inv_clientes > 0
            ))
          )

        var campaign = Object.values(result)
          .map((x) => campanas = {
            id_inv_campanas: x.id_inv_campanas,
            nombre_campanas: x.nombre_campanas,
          })
          .filter((thing, index, self) =>
            index === self.findIndex((t) => (
              t.id_inv_campanas === thing.id_inv_campanas &&
              t.id_inv_campanas > 0
            ))
          )

        var service = Object.values(result)
          .map((x) => servicios = {
            id_inv_servicios: x.id_inv_servicios,
            nombre_servicios: x.nombre_servicios,
          })
          .filter((thing, index, self) =>
            index === self.findIndex((t) => (
              t.id_inv_servicios === thing.id_inv_servicios &&
              t.id_inv_servicios > 0
            ))
          )

      // Build object
      var menu = {
        agent,
        supervisor,
        queue,
        client,
        campaign,
        service,
      }

        // .filter((elem, pos, arr) => arr.indexOf(elem) == pos);

        var uniqEs6 = (rawData) => arrArg.filter((elem, pos, arr) => arr.indexOf(elem) == pos);

        res.send(JSON.stringify(menu));
         //console.log(querySQL);

      }
  catch(err) {
    console.log('Server error');
      console.log(querySQL);
    res.status(500).send('Server error');
    // throw new Error(err)
  }
});


module.exports = router
