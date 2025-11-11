const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const { getConnection } = require('./auroraClient.js'); // Adjust path as needed
require('dotenv').config({ path: '../../.env' });

const CSV_FILE = './dataAurora.csv'; // Update the path as needed

async function bulkInsertFromCSV() {
  const users = [];

  // Read and parse CSV, hash passwords
  await new Promise((resolve, reject) => {
    fs.createReadStream(CSV_FILE)
      .pipe(csv())
      .on('data', (row) => {
        users.push(row);
      })
      .on('end', resolve)
      .on('error', reject);
  });

  // Hash passwords in parallel
  const userParams = await Promise.all(users.map(async (user, i) => {
    if (!user.password) {
      console.error(`⚠️ Missing password for row ${i + 1}:`, user);
    }
    return [
      parseInt(user.id, 10),
      user.email,
      await bcrypt.hash(user.password || 'defaultPass123', 10),
      user.isProvider.toLowerCase() === 'true'
    ];
  }));

  // Insert into DB
  const placeholders = userParams
  .map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`)
  .join(', ');


  const flatValues = userParams.flat();

  const sql = `
    INSERT INTO users (id, email, password, isProvider)
    VALUES ${placeholders}
  `;

  const client = await getConnection();
  try {
    await client.query('BEGIN');
    await client.query(sql, flatValues);
    await client.query('COMMIT');
    console.log('Bulk insert completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Bulk insert failed:', err);
  } finally {
    client.release();
  }
}

bulkInsertFromCSV().catch(console.error);