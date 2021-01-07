const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Razorpay = require('razorpay');

require('dotenv').config();

const instance = new Razorpay({
  key_id:"rzp_test_B8z0h0tSwehzlt",
  key_secret: "PcAzv1To38bOPQ71CfXLamVa",
});

const app = express();

/* CORS setup */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); /* *.name.domain for production  */
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});
app.options('*', cors());
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
const port = process.env.PORT || 5000;
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server running on port 5000`);
});
