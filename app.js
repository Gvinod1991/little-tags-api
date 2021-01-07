const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Razorpay = require('razorpay');

require('dotenv').config();

const instance = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY,
  key_secret: process.env.RAZOR_PAY_SECRET,
});

const app = express();

/* CORS setup */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); /* *.name.domain for production  */
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});
app.use(cors());
/** Body parser setup */

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Little tag backend api!' });
});

app.post('/create-razor-pay-order', (req, res) => {
  const { amount, currency } = req.body;

  if (!amount) {
    res.json('Amount is required!');
  }
  if (!currency) {
    res.json('Currency is required!');
  }

  const order = instance.orders.create({ amount, currency });
  order.then((razorPayResponse) => {
    res.json({ status: 'success', data: razorPayResponse });
  }).catch((err) => {
    res.json({ status: 'error', error: err });
  });
});

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server running on port ${process.env.PORT}`);
});
