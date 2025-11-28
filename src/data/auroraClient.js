const { DsqlSigner } = require("@aws-sdk/dsql-signer");
const { Pool } = require("pg");

const ADMIN = "admin";
const NON_ADMIN_SCHEMA = "webApp";
const TOKEN_TTL_MS = 12 * 60 * 1000; // 12 minutes (tokens last 15 min, refresh earlier)

let pool;
let currentToken = null;
let tokenExpiration = 0;

// Función para obtener un token válido
async function getAuthToken(clusterEndpoint, user, region) {
  const now = Date.now();

  // Si el token aún es válido, lo reutilizamos
  if (currentToken && now < tokenExpiration) {
    return currentToken;
  }

  const signer = new DsqlSigner({
    hostname: clusterEndpoint,
    region,
    user: user === ADMIN ? undefined : user,
  });

  const token =
    user === ADMIN
      ? await signer.getDbConnectAdminAuthToken()
      : await signer.getDbConnectAuthToken();

  currentToken = token;
  tokenExpiration = now + TOKEN_TTL_MS;

  return token;
}

// Inicializar el pool
async function initPool() {
  const clusterEndpoint = process.env.CLUSTER_ENDPOINT;
  const user = process.env.CLUSTER_USER;
  const region = process.env.AWS_REGION;

  const token = await getAuthToken(clusterEndpoint, user, region);

  pool = new Pool({
    host: clusterEndpoint,
    user: user,
    password: token,
    database: "postgres",
    port: 5432,
    max: 10,
    idleTimeoutMillis: 10 * 60 * 1000, // 10 minutes - less than token TTL
    connectionTimeoutMillis: 5000,
    ssl: { rejectUnauthorized: true },
  });

  // Set search path on connect
  pool.on("connect", async (client) => {
    await client.query("SET search_path=" + NON_ADMIN_SCHEMA);
  });

  return pool;
}

// Recrear el pool con un nuevo token
async function recreatePool() {
  if (pool) {
    await pool.end();
  }
  return await initPool();
}

// Obtener un cliente desde el pool
async function getConnection() {
  const now = Date.now();
  
  // Si el token está próximo a expirar, recrear el pool
  if (!pool || now >= tokenExpiration - (2 * 60 * 1000)) { // 2 min buffer
    await recreatePool();
  }
  
  const client = await pool.connect();
  return client;
}

// Cerrar el pool cuando la aplicación se cierre
async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

module.exports = { getConnection, initPool, closePool };