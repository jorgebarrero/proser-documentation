import * as pool from "../../../connectors/pool";
import { removeRowDataPacket } from "../../helpers/mysql-helper.js";
import moment from "moment";

// Read actual records
async function eraseTestData() {
  let result = null;

  let querySQL = `

  DELETE FROM RealCurrentAgents;
  DELETE FROM RealCurrentBreaks;
  DELETE FROM RealCurrentCalls;
  DELETE FROM RealAudit;
  DELETE FROM RealCdr;
  DELETE FROM RealCallEntry;
  DELETE FROM RealHcaAgent;
  DELETE FROM RealHcaQueue;
  DELETE FROM RealQueueLog;


  `;

  // return new Promise((resolve, reject) => {
  //   resolve(pool.destiny.query(querySQL));
  //   reject(`Error`);
  // });

  try {
    result = await pool.destiny.query(querySQL);
  } catch (error) {
    result = { error: error };
  }

  return result;
}

async function erase() {
  console.clear();
  console.log("***********  BORRANDO TABLAS REAL ***********");
  await eraseTestData();
  console.log("Todo borrado");
  process.exit(0);
}


erase();
