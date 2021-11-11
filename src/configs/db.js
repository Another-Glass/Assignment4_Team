const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  dbDATABASE: process.env.RDS_DATABASE,
  dbUSERNAME: process.env.RDS_USERNAME,
  dbPASSWORD: process.env.RDS_PASSWORD,
  dbHOSTNAME: process.env.RDS_HOSTNAME,
  dbPORT: process.env.RDS_PORT,
};
