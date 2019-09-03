/*
 * INDICADORES
 *
 */

// Dependencias
import express from 'express';
import bodyParser from 'body-parser';
// import _ from 'lodash';
import myPool from './../../connections/pool';
import dates from './../../functions/dates';
import fields from './../../functions/fields';
import { SelectionConfig } from '../../models/selection';

const router = express.Router();
const poolDat = myPool.poolDat;

router.use(bodyParser.json());

/*****************************************************************
 * MENU MULTIPLE
 */
router.post(`/menu_multiple/`, async (req, res) => {
  
  // Preparation
  let selection = new SelectionConfig;
  let filter = new SelectionConfig;
  
  
  selection = req.body;
  
  

  const filterObject = dates.returnDateFilter ( selection.fecha_inicio, selection.fecha_final );

  const tabla_cdr = fields.tableCdrFilter(selection.fecha_inicio);

  const fiterTest = dates.returnDateFilter ( selection.fecha_inicio, selection.fecha_final );


  let filtro_fecha_inicio = filterObject.start;
  let filtro_fecha_final = filterObject.end;

  let filtro;
  let filtro_otro = ``;

  /************************************************* */

  let clientes;
  let colas;
  let servicios;
  let campanas;

  let supervisores;
  let suplentes;
  let agentes;
  let horarios;

  let escalas;

  /************************************************* */

  let clientes_err;
  let colas_err;
  let servicios_err;
  let campanas_err;

  let supervisores_err;
  let suplentes_err;
  let agentes_err;
  let horarios_err;

  let escalas_err;

  let ok = true;

  let querySQL_clientes = `
    SELECT

      id_inv_clientes AS id,
      nombre_clientes AS name,
      count(id_inv_clientes) as registros

      FROM
      ${tabla_cdr}
      WHERE
      id_inv_clientes <> 0 AND  id_inv_clientes <> '0' AND  id_inv_clientes <> ''
      ${filtro_fecha_inicio}
      ${filtro_fecha_final}
      ${filtro_otro}


    GROUP BY id_inv_clientes
    `;

  // Data base access
  try {
    var result = await poolDat.query(querySQL_clientes);
    clientes = result;
    ok = true;
    // res.send(JSON.stringify(result));
    // console.log(querySQL);
  } catch (err) {

    // console.log(querySQL_clientes);
    clientes_err = {
      status: 500,
      origin: `clientes`,
      filtro: filtro,
      query: querySQL_clientes,
      error: err
    };
    console.log(`Server error clientes`, clientes_err);
    ok = false;
    // res.status(500).send(`Server error clientes`);
    // throw new Error(err)
  }

  /************************************************************* */

  let querySQL_colas = `
    SELECT

      numero_colas AS id,
      nombre_colas AS name

  FROM
      ${tabla_cdr}
  WHERE
  numero_colas <> 0 AND  numero_colas <> '0' AND  numero_colas <> ''
  ${filtro_fecha_inicio}
  ${filtro_fecha_final}
  ${filtro_otro}

    GROUP BY numero_colas
    `;

  // Data base access
  try {
    var result = await poolDat.query(querySQL_colas);
    colas = result;
    ok = true;
    // res.send(JSON.stringify(result));
    // console.log(querySQL_colas);
  } catch (err) {
    console.log(`Server error colas`);
    // console.log(querySQL_colas);
    colas_err = {
      status: 500,
      origin: `colas`,
      filtro: filtro,
      query: querySQL_colas,
      error: err
    };
    ok = false;
    // res.status(500).send(`Server error colas`);
    // throw new Error(err)
  }

  /************************************************************* */

  let querySQL_servicios = `
    SELECT

      id_inv_servicios AS id,
      nombre_servicios AS name

      FROM
      ${tabla_cdr}
  WHERE
  id_inv_servicios <> 0 AND  id_inv_servicios <> '0' AND  id_inv_servicios <> ''
  ${filtro_fecha_inicio}
  ${filtro_fecha_final}
  ${filtro_otro}

    GROUP BY id_inv_servicios
    `;

  // Data base access
  try {
    var result = await poolDat.query(querySQL_servicios);
    servicios = result;
    ok = true;
    // res.send(JSON.stringify(result));
    // console.log(querySQL_servicios);
  } catch (err) {
    console.log(`Server error servicios`);
    // console.log(querySQL_servicios);
    servicios_err = {
      status: 500,
      origin: `servicios`,
      filtro: filtro,
      query: querySQL_servicios,
      error: err
    };
    ok = false;
    // res.status(500).send(`Server error servicios`);
    // throw new Error(err)
  }

  /************************************************************* */

  let querySQL_campanas = `
    SELECT

      id_inv_campanas AS id,
      nombre_campanas AS name

      FROM
      ${tabla_cdr}
  WHERE
  id_inv_campanas <> 0 AND  id_inv_campanas <> '0' AND  id_inv_campanas <> ''
  ${filtro_fecha_inicio}
  ${filtro_fecha_final}
  ${filtro_otro}


    GROUP BY id_inv_campanas
    `;

  // Data base access
  try {
    var result = await poolDat.query(querySQL_campanas);
    campanas = result;
    ok = true;
    // res.send(JSON.stringify(result));
    // console.log(querySQL_campanas);;
  } catch (err) {
    console.log(`Server error campanas`);
    // console.log(querySQL_campanas);
    campanas_err = {
      status: 500,
      origin: `campanas`,
      filtro: filtro,
      query: querySQL_campanas,
      error: err
    };
    ok = false;
    // res.status(500).send(`Server error campanas`);
    // throw new Error(err)
  }

  /************************************************************* */

  let querySQL_supervisores = `
    SELECT

      id_inv_supervisores AS id,
      nombre_supervisores AS name

      FROM
      ${tabla_cdr}
  WHERE
      id_inv_supervisores <> 0 AND  id_inv_supervisores <> '0' AND  id_inv_supervisores <> ''
      ${filtro_fecha_inicio}
      ${filtro_fecha_final}
      ${filtro_otro}


    GROUP BY id_inv_supervisores
    `;

  // Data base access
  try {
    var result = await poolDat.query(querySQL_supervisores);
    supervisores = result;
    ok = true;
    // res.send(JSON.stringify(result));
    // console.log(querySQL_supervisores);
  } catch (err) {
    console.log(`Server error supervisores`);
    // console.log(querySQL_supervisores);
    supervisores_err = {
      status: 500,
      origin: `supervisores`,
      filtro: filtro,
      query: querySQL_supervisores,
      error: err
    };
    ok = false;
    // res.status(500).send(`Server error supervisores`);
    // throw new Error(err)
  }

  /************************************************************* */

  let querySQL_suplentes = `
    SELECT

    id_inv_suplentes AS id,
    nombre_suplentes AS name

    FROM
    ${tabla_cdr}
WHERE
id_inv_suplentes <> 0 AND  id_inv_suplentes <> '0' AND  id_inv_suplentes <> ''
${filtro_fecha_inicio}
${filtro_fecha_final}
${filtro_otro}

    GROUP BY id_inv_suplentes
    `;

  // Data base access
  try {
    var result = await poolDat.query(querySQL_suplentes);
    suplentes = result;
    ok = true;
    // res.send(JSON.stringify(result));
    // console.log(querySQL_suplentes);
  } catch (err) {
    console.log(`Server error suplentes`);
    // console.log(querySQL_suplentes);
    suplentes_err = {
      status: 500,
      origin: `suplentes`,
      filtro: filtro,
      query: querySQL_suplentes,
      error: err
    };
    ok = false;
    // res.status(500).send(`Server error suplentes`);
    // throw new Error(err)
  }

  /************************************************************* */

  let querySQL_agentes = `
    SELECT

      id_inv_agentes AS id,
      nombre_agentes AS name

      FROM
      ${tabla_cdr}
  WHERE
  id_inv_agentes <> 0 AND  id_inv_agentes <> '0' AND  id_inv_agentes <> ''
  ${filtro_fecha_inicio}
  ${filtro_fecha_final}
  ${filtro_otro}


    GROUP BY id_inv_agentes
    `;

  // Data base access
  try {
    var result = await poolDat.query(querySQL_agentes);
    agentes = result;
    ok = true;
    // res.send(JSON.stringify(result));
    // console.log(querySQL_agentes);
  } catch (err) {
    console.log(`Server error agentes`);
    // console.log(querySQL_agentes);
    agentes_err = {
      status: 500,
      origin: `agentes`,
      filtro: filtro,
      query: querySQL_agentes,
      error: err
    };
    ok = false;
    // res.status(500).send(`Server error agentes`);
    // throw new Error(err)
  }

  /************************************************************* */

  let querySQL_horairios = `
    SELECT

      id_inv_horarios AS id,
      nombre_horarios AS name

      FROM
      ${tabla_cdr}
  WHERE
  id_inv_horarios <> 0 AND  id_inv_horarios <> '0' AND  id_inv_horarios <> ''

      ${filtro_fecha_inicio}
      ${filtro_fecha_final}
      ${filtro_otro}

    GROUP BY id_inv_horarios
    `;

  // Data base access
  try {
    var result = await poolDat.query(querySQL_horairios);
    horarios = result;
    // res.send(JSON.stringify(result));
    // console.log(querySQL_horairios);
  } catch (err) {
    console.log(`Server error horarios`);
    // console.log(querySQL_horairios);
    ok = true;
    horarios_err = {
      status: 500,
      origin: `horarios`,
      filtro: filtro,
      query: querySQL_horairios,
      error: err
    };
    ok = false;
    // res.status(500).send(`Server error horarios`);
    // throw new Error(err)
  }

  /************************************************************* */

  let querySQL_escalas = `
    SELECT

      id_inv_escalas AS id,
      nombre_escalas AS name

      FROM
      ${tabla_cdr}
  WHERE
    id_inv_escalas <> 0 AND  id_inv_escalas <> '0' AND  id_inv_escalas <> ''
      ${filtro_fecha_inicio}
      ${filtro_fecha_final}
      ${filtro_otro}


    GROUP BY id_inv_escalas
    `;

  // Data base access
  try {
    var result = await poolDat.query(querySQL_escalas);
    escalas = result;
    ok = true;
    // res.send(JSON.stringify(result));
    // console.log(querySQL_escalas);
  } catch (err) {
    console.log(`Server error escalas`);
    // console.log(querySQL_escalas);
    escalas_err = {
      status: 500,
      origin: `escalas`,
      filtro: filtro,
      query: querySQL_escalas,
      error: err
    };
    ok = false;
    //  res.status(500).send(`Server error escalas`);
    // throw new Error(err)
  }

  let menus_final = {
    clientes,
    colas,
    servicios,
    campanas,

    supervisores,
    suplentes,
    agentes,
    horarios,

    escalas
  };

  let error_final = {
    clientes_err,
    colas_err,
    servicios_err,
    campanas_err,

    supervisores_err,
    suplentes_err,
    agentes_err,
    horarios_err,

    escalas_err
  };

  /************************************************************* */
  if (menus_final && ok) {
    // console.log(`querySQL`, querySQL_clientes);

    res.send(JSON.stringify(menus_final));
  } else {
    if (error_final && !ok) {
      res.status(500).send(error_final);
    }
  }
});

/************************END ALL ***************************** */

module.exports = router;
