const express = require('express');
const {
    getInvoices,
    getInvoice,
    addInvoice,
    updateInvoice,
    deleteInvoice,
} = require('../controllers/invoices');
const advancedResults = require('../middleware/advancedResults');

const Tax = require('../models/Invoice');
const { protect, authorize } = require('../middleware/auth');

const Invoice = require('../models/Invoice')
const router = express.Router({ mergeParams: true });


router
    .route('/')
    .get(protect, advancedResults(Invoice, {
        path: 'bootcamp',
      }) , getInvoices)
    .post(protect , addInvoice);

router
    .route('/:id')
    .get(protect ,getInvoice)
    .put(protect , updateInvoice)
    .delete(protect ,deleteInvoice);
module.exports = router;
