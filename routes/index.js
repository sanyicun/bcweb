var express = require('express');
var router = express.Router();

const config = require('../app/models/config');
const request = require('request');

router.get('/', function(req, res, next) {
  res.render('login2', { title: 'BTC Wallet' });
});

//Logging in
router.post('/login', function(req, res, next) {
  request.post({
    url: config.apiUrl + '/auth/token',
    json: req.body
  }).pipe(res);
});

router.get('/login', function(req, res, next) {
	res.render('login', {title: 'Login'});
});


//Getting Wallet page
router.get('/wallet', function(req, res, next) {
  res.render('wallet', {title: 'Wallets'});
});

//add Test page
router.get('/gamelist', function(req, res, next) {
  res.render('gamelist', {title: 'Test'});
});
router.get('/homepage', function(req, res, next) {
  res.render('homepage', {title: 'Homepage'});
});

router.get('/tables', function(req, res, next) {
  res.render('tables', {title: 'Homepage'});
});

router.get('/table:tableid', function(req, res, next) {
  res.render('table', {title: 'Homepage'});
});

//Getting Transactions page
router.get('/transactions', function(req, res, next) {
  res.render('transactions', {title: 'Transactions'});
});

//Responding with the Backend call for all transactions
router.get('/transactionsBackend/:walletid', function(req, res, next) {
  request.get({
    url: config.apiUrl + '/wallets/' + req.params.walletid + '/transaction',
    headers: {'x-access-token': req.headers['x-access-token']}
  }).pipe(res);
});

//Getting Wallet id's
router.get('/walletsBackend', function(req, res, next) {
  request.get({
      url: config.apiUrl + '/wallets',
      headers: {'x-access-token': req.headers['x-access-token']}
   }).pipe(res);
})

//Getting a wallet address from its id
router.post('/walletAddress/:walletid', function(req, res, next){
  request.post({
      url: config.apiUrl + '/wallets/' + req.params.walletid + '/address',
      json: req.body
  }).pipe(res);
})

//Sending value from a wallet to another wallet
router.post('/send/:walletid', function(req, res, next) {
  request.post({
    url: config.apiUrl + '/wallet/' + req.params.walletid + '/transaction',
    json: req.body
  }).pipe(res);
});

router.get('/receive', function(req, res, next) {
	res.render('receive', {title: "Receive"});
});

router.get('/register', function(req, res, next) {
	res.render('register', {title: "Register"});
})

//Creating a new user
router.post('/register', function(req, res, next) {
  request.post({
    url: config.apiUrl + '/users',
    json: req.body
  }).pipe(res);
});

//Get Wallet address
router.post('/receive', function(req, res, next) {
  request.post({
    url:  config.apiUrl + '/wallets/'.concat('wallet-id').concat('/address'),
    body: req.body
  }).pipe(res);
  res.render('/register', {title: 'Register'});
});

module.exports = router;
