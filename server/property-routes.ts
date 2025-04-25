import { ClientError } from './lib/index.js';
import express from 'express';
import pg from 'pg';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const router = express.Router();

// GET all properties for a user
router.get('/:userId', async (req, res, next) => {
  try {
    console.log(`GET /properties/${req.params.userId} requested`);

    const userId = Number(req.params.userId);
    if (!userId) {
      console.warn(`Invalid userId provided: ${req.params.userId}`);

      throw new ClientError(400, 'userId is required');
    }

    const sql = `
        SELECT * from "properties"
        WHERE "userId" = $1
        ORDER by "propertyId"
        `;
    const result = await db.query(sql, [userId]);
    console.log(`Found ${result.rows.length} properties for user ${userId}`);

    res.json(result.rows);
  } catch (err) {
    console.error(`Error in GET /properties/${req.params.userId}:`, err);

    next(err);
  }
});

// GET a property by ID
router.get('/property/:propertyId', async (req, res, next) => {
  try {
    console.log(`GET /properties/property/${req.params.propertyId} requested`);

    const propertyId = Number(req.params.propertyId);
    if (!propertyId) {
      console.warn(`Invalid propertyId provided: ${req.params.propertyId}`);

      throw new ClientError(400, 'propertyId is required');
    }

    const sql = `
        SELECT * from "properties"
        WHERE "propertyId" = $1
        `;
    const result = await db.query(sql, [propertyId]);
    console.log(`Found property with id ${propertyId}`);

    if (result.rows.length === 0) {
      console.warn(`Property with id ${propertyId} not found`);

      throw new ClientError(404, `Property with id ${propertyId} not found`);
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(
      `Error in GET /properties/property/${req.params.propertyId}:`,
      err
    );

    next(err);
  }
});

// POST a new property
router.post('/', async (req, res, next) => {
  try {
    console.log('POST /properties requested');

    const {
      userId,
      address,
      estValue,
      range,
      type,
      beds,
      bath,
      sqft,
      built,
      lastSale,
    } = req.body;
    if (
      !userId ||
      !address ||
      !estValue ||
      !range ||
      !type ||
      !beds ||
      !bath ||
      !sqft ||
      !built ||
      !lastSale
    ) {
      console.warn('Missing required fields');

      throw new ClientError(400, 'Missing required fields');
    }

    const sql = `
        INSERT into "properties" 
        ("userId",  
        "address",
        "estValue",
        "range",
        "type",
        "beds",
        "bath",
        "sqft",
        "built",
        "lastSale")
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
        `;

    const params = [
      userId,
      address,
      estValue,
      range,
      type,
      beds,
      bath,
      sqft,
      built,
      lastSale,
    ];
    console.log('Params:', params);

    const result = await db.query(sql, params);
    console.log('Result:', result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error in POST /properties:', err);

    next(err);
  }
});

// PUT to update a property
router.put('/:propertyId', async (req, res, next) => {
  try {
    console.log('Put Property Request params:', req.params);
    console.log('Put Property Request body:', req.body);

    const propertyId = Number(req.params.propertyId);
    if (!propertyId) {
      console.warn('Invalid propertyId provided:', req.params.propertyId);
      throw new ClientError(400, 'propertyId is required');
    }

    const {
      address,
      estValue,
      range,
      type,
      beds,
      bath,
      sqft,
      built,
      lastSale,
    } = req.body;

    const sql = `
        UPDATE "properties"
        SET "address" = $1,
        "estValue" = $2,
        "range" = $3,
        "type" = $4,
        "beds" = $5,
        "bath" = $6,
        "sqft" = $7,
        "built" = $8,
        "lastSale" = $9
        WHERE "propertyId" = $10
        RETURNING *;
        `;

    const params = [
      address || null,
      estValue !== undefined ? estValue : null,
      range !== undefined ? range : null,
      type || null,
      beds || null,
      bath || null,
      sqft !== undefined ? sqft : null,
      built !== undefined ? built : null,
      lastSale || null,
      propertyId,
    ];

    const result = await db.query(sql, params);

    if (result.rows.length === 0) {
      throw new ClientError(404, `Property with id ${propertyId} not found`);
    }

    console.log('Updated property:', result.rows[0]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in PUT /properties/:propertyId:', err);

    next(err);
  }
});

// DELETE a property
router.delete('/:propertyId', async (req, res, next) => {
  try {
    console.log('Delete Property Request params:', req.params);

    const propertyId = Number(req.params.propertyId);

    if (!propertyId) {
      console.warn('Invalid propertyId provided:', req.params.propertyId);

      throw new ClientError(400, 'propertyId is required');
    }

    const sql = `
      DELETE FROM "properties"
      WHERE "propertyId" = $1
      RETURNING *
    `;

    const result = await db.query(sql, [propertyId]);

    if (result.rows.length === 0) {
      throw new ClientError(404, `Property with id ${propertyId} not found`);
    }

    console.log('Deleted property:', result.rows[0]);

    res.sendStatus(204);
  } catch (err) {
    console.error('Error in DELETE /properties/:propertyId:', err);

    next(err);
  }
});

export default router;
