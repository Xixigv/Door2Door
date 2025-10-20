const { DsqlSigner } =  require("@aws-sdk/dsql-signer");
const pg = require("pg");
const { Client } = pg;

require('dotenv').config();

const ADMIN = "admin";
const NON_ADMIN_SCHEMA = "webApp";

async function getConnection(clusterEndpoint, user, region) {
      const signer = new DsqlSigner({
        hostname: clusterEndpoint,
        region,
      });
      let token;
      // Generate a fresh password token for each connection, to ensure the token is
      // not expired when the connection is established
      if (user === ADMIN) {
        token = await signer.getDbConnectAdminAuthToken();
      }
      else {
        signer.user = user;
        token = await signer.getDbConnectAuthToken()
      }
      let client = new Client({
        host: clusterEndpoint,
        user: user,
        password: token,
        database: "postgres",
        port: 5432,
        ssl: {
          rejectUnauthorized: true,
        }
      });
  
      // Connect
      await client.connect();
      console.log("Successfully opened connection");
      return client;
}

async function example() {

  const clusterEndpoint = process.env.CLUSTER_ENDPOINT;
  const user = process.env.CLUSTER_USER;
  const region = 'us-east-2';

  let client;
  try {
    client = await getConnection(clusterEndpoint, user, region);

    if (user !== ADMIN) {
      await client.query("SET search_path=" + NON_ADMIN_SCHEMA)
    }

    // Check that data is inserted by reading it back
    const result = await client.query("SELECT NOW() as timestamp, version();");

    console.log("Current time:", result.rows[0].timestamp);
    console.log("PostgreSQL version:", result.rows[0].version);

  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client?.end()
  }
  Promise.resolve()
}

example();