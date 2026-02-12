const express = require('express');
console.log('Express module loaded:', express);
console.log('Express Router:', express.Router);

const app = express();
const router = express.Router();

console.log('App created:', app);
console.log('Router created:', router);

console.log('Test passed!');
