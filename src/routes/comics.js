const express = require('express');
const router = express.Router();
const xkcdService = require('../services/xkcdService');
const { param, query, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg
    });
  }
  next();
};

// GET /api/comics/latest
router.get('/latest', async (req, res, next) => {
  try {
    const comic = await xkcdService.getLatest();
    res.json(comic);
  } catch (error) {
    next(error);
  }
});

// Implement GET /api/comics/random (register before parameterized routes)
router.get('/random', async (req, res, next) => {
  try {
    const comic = await xkcdService.getRandom();
    res.json(comic);
  } catch (error) {
    next(error);
  }
});

// Implement GET /api/comics/search (register before parameterized routes)
router.get('/search',
  [
    query('q')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Query must be between 1 and 100 characters'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50')
  ],
  validate,
  async (req, res, next) => {
    try {
      const q = req.query.q;
      const page = req.query.page ? parseInt(req.query.page, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

      const results = await xkcdService.search(q, page, limit);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
);

//Implement GET /api/comics/:id
router.get('/:id',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Comic ID must be a positive integer')
  ],
  validate,
  async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const comic = await xkcdService.getById(id);
      res.json(comic);
    } catch (error) {
      next(error);
    }
  }
);

//Implement GET /api/comics/random
router.get('/random', async (req, res, next) => {
  try {
    const comic = await xkcdService.getRandom();
    res.json(comic);
  } catch (error) {
    next(error);
  }
});

//Implement GET /api/comics/search
router.get('/search',
  [
    query('q')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Query must be between 1 and 100 characters'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50')
  ],
  validate,
  async (req, res, next) => {
    try {
      const q = req.query.q;
      const page = req.query.page ? parseInt(req.query.page, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

      const results = await xkcdService.search(q, page, limit);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;