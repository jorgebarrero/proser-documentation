/*
 * CDR
 *
 */

// Dependencias
import express from "express";
import bodyParser from "body-parser";
// import _ from 'lodash';
import myPool from "./../../connections/pool";
import dates from "./../../functions/dates";
import fields from "./../../functions/fields";
import time from "./../../functions/time";
import { SelectionConfig } from "../../models/selection";

const router = express.Router();

const poolDat = myPool.poolDat;

router.use(bodyParser.json());

router.get("/hola", async function(req, res, next) {
  res.status(201).send('Hola');
});

/* ************************************************************************************* */
// LIST
router.post("/list", async (req, res, next) => {
  let selection = new SelectionConfig();
  let filter = new SelectionConfig();
  let filter_like = new SelectionConfig();
  selection = req.body;

  let result_cdr = [];

  let error_cdr;

  let result_final;

  let today = dates.dateToText(new Date());

  // Preparation

  let tabla_cdr = fields.tableCdrFilter(selection.fecha_inicio); // a_clasif_cdr, a_hist_cdr_clasif
  let tabla_audit = fields.tableAuditFilter(selection.fecha_inicio); /// a_clasif_audit, a_clasif_audit_hist
  let tabla_personas = `a_clasif_personas`; // a_clasif_personas, a_clasif_personas_hist

  filter.minutos_intervalo = selection.minutos_intervalo.value
    ? selection.minutos_intervalo.value
    : 30; // { 'id': 30, 'name': '30 min', 'value': 30 }

  filter.llamada_clasificacion = ``;

  filter.desde = fields.fieldOneFilter("fecha", ">=", selection.desde); // full time
  filter.hasta = fields.fieldOneFilter("fecha", "<=", selection.hasta); // full time

  filter.hora_inicio = `AND hora >= '${selection.hora_inicio.hour}'`; // 'formato hh:mm:ss'
  filter.hora_final = `AND hora <= '${selection.hora_final.hour}'`; // formato hh:mm:ss

  filter.colas = fields.fieldMultipleFilter(
    selection.colas,
    "numero_colas",
    "id"
  );
  filter.clientes = fields.fieldMultipleFilter(
    selection.clientes,
    "id_inv_clientes",
    "id"
  );
  filter.campanas = fields.fieldMultipleFilter(
    selection.campanas,
    "id_inv_campanas",
    "id"
  );
  filter.servicios = fields.fieldMultipleFilter(
    selection.servicio,
    "id_inv_servicio",
    "id"
  );

  filter.supervisores = fields.fieldMultipleFilter(
    selection.supervisores,
    "id_inv_supervisores",
    "id"
  );
  filter.suplentes = fields.fieldMultipleFilter(
    selection.suplentes,
    "id_inv_suplentes",
    "id"
  );
  filter.agentes = fields.fieldMultipleFilter(
    selection.agentes,
    "id_inv_agentes",
    "id"
  );
  filter.horarios = fields.fieldMultipleFilter(
    selection.horarios,
    "id_inv_horarios",
    "id"
  );

  filter.group = "GROUP BY date";

  // FILTROS PARA AUDIT
  filter_like.colas = fields.fieldMultipleFilterLike(
    selection.colas,
    "numero_colas",
    "id"
  );
  filter_like.clientes = fields.fieldMultipleFilterLike(
    selection.clientes,
    "id_inv_clientes",
    "id"
  );
  filter_like.campanas = fields.fieldMultipleFilterLike(
    selection.campanas,
    "id_inv_campanas",
    "id"
  );
  filter_like.servicios = fields.fieldMultipleFilterLike(
    selection.servicio,
    "id_inv_servicio",
    "id"
  );

  filter_like.supervisores = fields.fieldMultipleFilterLike(
    selection.supervisores,
    "id_inv_supervisores",
    "id"
  );
  filter_like.suplentes = fields.fieldMultipleFilterLike(
    selection.suplentes,
    "id_inv_suplentes",
    "id"
  );
  filter_like.agentes = fields.fieldMultipleFilterLike(
    selection.agentes,
    "id_inv_agentes",
    "id"
  );
  filter_like.horarios = fields.fieldMultipleFilterLike(
    selection.horarios,
    "id_inv_horarios",
    "id"
  );

  filter_like.desde = fields.fieldOneFilter("fecha", ">=", selection.desde); // full time
  filter_like.hasta = ""; //fields.fieldOneFilter( 'fecha', '<=', selection.hasta );  // full time

  let querySQL_cdr = `

  SELECT
*

  FROM
    ${tabla_cdr}

  WHERE 1


  ${filter.desde}
  ${filter.hasta}

  ${filter.hora_inicio}
  ${filter.hora_final}


  ${filter.colas}
  ${filter.clientes}
  ${filter.campanas}
  ${filter.servicios}

  ${filter.supervisores}
  ${filter.suplentes}
  ${filter.agentes}
  ${filter.horarios}


  `;

  // Data base access
  try {
    var result = await poolDat.query(querySQL_cdr);
    result_cdr = result;
    console.log("****** CDR ******");
    console.log(result_cdr.length);
    console.log(querySQL_cdr);
    res.status(201).send(result_cdr);
  } catch (err) {
    error_cdr = {
      status: 500,
      origin: `cdr`,
      query: querySQL_cdr,
      error: err
    };
    res.status(500).send(error_cdr);
  }
});

// module.exports = router;
export default router;
