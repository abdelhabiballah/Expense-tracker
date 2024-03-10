const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const achats = require('./routes/achat');
const codes = require('./routes/codes');
const taxs = require('./routes/taxs') ;
const invoices = require('./routes/invoices')
const products = require('./routes/products')
const categories = require('./routes/categories')
const companies = require('./routes/companies')
const paiements = require('./routes/paiements')
const suppliers = require('./routes/suppliers')
const expenses = require('./routes/expenses')
const recus = require('./routes/recus')
const devis = require('./routes/devis')
const accounts = require('./routes/accountings')







dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

// Body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000, // 10 mins
  max: 1000,
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/clients', bootcamps);
app.use('/commendes', courses);
app.use('/achats', achats);
app.use('/codes', codes)
app.use('/auth', auth);
app.use('/users', users);
app.use('/taxs', taxs);
app.use('/invoices', invoices);
app.use('/items', products);
app.use('/categories', categories);
app.use('/companies', companies);
app.use('/paiements', paiements);
app.use('/suppliers', suppliers);
app.use('/expenses', expenses);
app.use('/recus', recus);
app.use('/devis', devis);
app.use('/accounts', accounts);









app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);

  // Close server & exit process
  server.close(() => process.exit(1));
});
