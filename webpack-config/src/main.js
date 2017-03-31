
import {a} from 'test.js'
import './index.css'

var img = require('./kaka1.jpg')

var app = document.getElementById('app')

app.innerHTML = `<img src= ${img}>`

var b = a(3)
console.log(b)