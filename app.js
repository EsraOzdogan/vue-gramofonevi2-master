require('dotenv').load();
var express = require('express');
var path = require('path');
var fs = require('fs');
var morgan     = require("morgan");
var bodyParser = require('body-parser');
var jwt = require("jsonwebtoken");
var expressJwt = require('express-jwt');
var mongoose   = require("mongoose");
mongoose.connect('mongodb://localhost/vuelogin');
var User = require('./models');

const PRODUCT_DATA_FILE = path.join(__dirname, 'server-product-data.json');
const CART_DATA_FILE = path.join(__dirname, 'server-cart-data.json');
const USERS_DATA_FILE = path.join(__dirname, 'server-users-data.json');
const PRODUCT1_DATA_FILE = path.join(__dirname, 'server-product1-data.json');
const PRODUCT2_DATA_FILE = path.join(__dirname, 'server-objekoleksiyonu-data.json');

app.get('/products1', (req, res) => {
  fs.readFile(PRODUCT1_DATA_FILE, (err, data) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.get('/products2', (req, res) => {
  fs.readFile(PRODUCT2_DATA_FILE, (err, data) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});
app.get('/cart', (req, res) => {
  fs.readFile(CART_DATA_FILE, (err, data) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.get('/users', (req, res) => {
  fs.readFile(USERS_DATA_FILE, (err, data) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});
var app = express();
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","POST,GET");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

var auth = expressJwt({ secret: process.env.JWT_SECRET });

app.post('/api/login', function(req, res) {
  User.findOne({name: req.body.name, password: req.body.password}, function(err, user) {
    if (err) {
      res.send({
        type: false,
        data: "Error occured: " + err
      });
    } else {
      if (user) {
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        var token = jwt.sign({
          _id: user._id,
          email: user.email,
          name: user.name,
          exp:parseInt(expiry.getTime()/1000)
        },process.env.JWT_SECRET);
        res.send({
          type: true,
          data: user,
          token: token
        });
      } else {
        res.send({
          type: false,
          data: "Giriş yanlış"
        });
      }
    }
  });
});

app.post('/api/logout',auth, function(req, res) {
  res.send({
    type: "1"
  })
});

app.post('/api/reg', function(req, res) {
  User.findOne({name: req.body.name, password: req.body.password}, function(err, user) {
    if (err) {
      res.send({
        type: false,
        data: "Error occured: " + err
      });
    } else {
      if (user) {
        res.send({
          type: false,
          data: "Kayıt yanlış"
        });
      } else {
        var userModel = new User();
        userModel.name = req.body.name;
        userModel.password = req.body.password;
        userModel.save(function(err, user) {
          user.save(function(err, user1) {
            var expiry = new Date();
            expiry.setDate(expiry.getDate() + 7);
            var token = jwt.sign({
              _id: user._id,
              email: user.email,
              name: user.name,
              exp:parseInt(expiry.getTime()/1000)
            },process.env.JWT_SECRET);
            res.send({
              type: true,
              data: user,
              token: token
            });
          });
        })
      }
    }
  });
});

app.use(function(err, req, res, next) {
  if (err.name == 'UnauthorizedError') {
    res.status(401);
    res.send({ message: err.name + ":" + err.message });
  }
});

app.get('/products', (req, res) => {
  fs.readFile(PRODUCT_DATA_FILE, (err, data) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.get('/cart', (req, res) => {
  fs.readFile(CART_DATA_FILE, (err, data) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.post('/cart', (req, res) => {
  fs.readFile(CART_DATA_FILE, (err, data) => {
    const cartProducts = JSON.parse(data);
    const newCartProduct = { id: req.body.id, title: req.body.title, description: req.body.description, price: req.body.price, quantity: 1 };
    let cartProductExists = false;
    cartProducts.map((cartProduct) => {
      if (cartProduct.id === newCartProduct.id) {
        cartProduct.quantity++;
        cartProductExists = true;
      }
    });
    if (!cartProductExists) cartProducts.push(newCartProduct);
    fs.writeFile(CART_DATA_FILE, JSON.stringify(cartProducts, null, 4), () => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(cartProducts);
    });
  });
});

app.post('/cart/delete', (req, res) => {
  fs.readFile(CART_DATA_FILE, (err, data) => {
    let cartProducts = JSON.parse(data);
    cartProducts.map((cartProduct) => {
      if (cartProduct.id === req.body.id && cartProduct.quantity > 1) {
        cartProduct.quantity--;
      } else if (cartProduct.id === req.body.id && cartProduct.quantity === 1) {
        const cartIndexToRemove = cartProducts.findIndex(cartProduct => cartProduct.id === req.body.id);
        cartProducts.splice(cartIndexToRemove, 1);
      }
    });
    fs.writeFile(CART_DATA_FILE, JSON.stringify(cartProducts, null, 4), () => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(cartProducts);
    });
  });
});

app.post('/cart/delete/all', (req, res) => {
  fs.readFile(CART_DATA_FILE, () => {
    let emptyCart = [];
    fs.writeFile(CART_DATA_FILE, JSON.stringify(emptyCart, null, 4), () => {
      res.json(emptyCart);
    });
  });
});


app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

