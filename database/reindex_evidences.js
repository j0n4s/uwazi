/* eslint-disable camelcase, no-console */
import request from '../app/shared/JSONRequest';
import search from '../app/api/evidences/searchEvidences.js';
import elasticMapping from './elastic_mapping';

import indexConfig from '../app/api/config/elasticIndexes';
import evidences from '../app/api/evidences/evidencesModel';
import mongoose from 'mongoose';

const limit = 200;
let docsIndexed = 0;
let pos = 0;
let spinner = ['|', '/', '-', '\\'];

function migrate(offset, totalRows) {
  return evidences.get({}, {}, {skip: offset, limit})
  .then((docsResponse) => {
    if (offset >= totalRows) {
      return;
    }

    return search.bulkIndex(docsResponse, 'index')
    .then(() => {
      process.stdout.write(`Indexing evidences... ${spinner[pos]} - ${docsIndexed} indexed\r`);
      pos += 1;
      if (pos > 3) {
        pos = 0;
      }
      docsIndexed += docsResponse.length;
      return migrate(offset + limit, totalRows);
    })
    .catch((err) => {
      console.log('ERR:', err);
    });
  });
}

const start = Date.now();
process.stdout.write(`Deleting index... ${indexConfig.index}\n`);
//let indexUrl = `http://localhost:9200/${indexConfig.index}/evidence/_delete_by_query`;
search.deleteAll()
.catch(console.log)
//.then(() => {
  //process.stdout.write(`Creating index... ${indexConfig.index}\n`);
  //request.put(indexUrl, elasticMapping).catch(console.log);
//})
.then(() => {
  return evidences.count()
  .then((total_rows) => {
    return migrate(0, total_rows)
    .catch((error) => {
      console.log('Migration error: ', error);
    });
  });
})
.then(() => {
  const end = Date.now();
  process.stdout.write(`Indexing evidences... - ${docsIndexed} indexed\r\n`);
  process.stdout.write(`Done, took ${(end - start) / 1000} seconds\n`);
  mongoose.disconnect();
});
