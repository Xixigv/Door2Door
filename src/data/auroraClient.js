const { DsqlSigner } = require("@aws-sdk/dsql-signer");
const { Pool } = require("pg");

const ADMIN = "admin";
const NON_ADMIN_SCHEMA = "webApp";
const TOKEN_TTL_MS = 14 * 60 * 1000;

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
  const region = 'us-east-2';

  const token = await getAuthToken(clusterEndpoint, user, region);

  pool = new Pool({
    host: clusterEndpoint,
    user: user,
    password: token,
    database: "postgres",
    port: 5432,
    max: 10, // número máximo de conexiones
    idleTimeoutMillis: 30000,
    ssl: { rejectUnauthorized: true },
  });

  // Antes de cada nueva conexión, refrescamos el token si es necesario
  pool.on("connect", async (client) => {
    const newToken = await getAuthToken(clusterEndpoint, user, region);
    client.password = newToken;
    await client.query("SET search_path=" + NON_ADMIN_SCHEMA)
  });

  return pool;
}

// Obtener un cliente desde el pool
async function getConnection() {
  if (!pool) {
    await initPool();
  }
  const client = await pool.connect();
  return client;
}

module.exports = { getConnection, initPool };
