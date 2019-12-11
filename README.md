# reactive-js
[![Latest Stable Version](https://img.shields.io/npm/v/reactive-js.svg)](https://www.npmjs.com/package/reactive-js)
[![NPM Downloads](https://img.shields.io/npm/dm/reactive-js.svg)](https://www.npmjs.com/package/reactive-js)
[![dependencies Status](https://david-dm.org/matejsvajger/reactive-js/status.svg)](https://david-dm.org/matejsvajger/reactive-js)

## Simple lightweight reactive object in vanilla js
### Installation
__Yarn__
```sh
$ yarn add reactive-js
```
__NPM:__
```sh
$ npm i reactive-js --save
```
__CDN__
```html
<script src="https://unpkg.com/reactive-js@1.0.0/dist/reactive.umd.js"></script>
```

### Usage
```js
import Reactive from 'reactive-js'

const toMonetaryString = num => `${num.toFixed(2).replace('.', ',')} €`
const updateElementById = id => html => document.getElementById(id).innerHTML = html

const product = new Reactive({
  qty: 2,
  price: 15,
  // computed props
  shipping: ({ qty }) => (qty > 0 ? 5 : 0),
  total: ({ qty, price, shipping }) => qty * price + shipping
})

// assign multiple formatters
product.format({
  total: toMonetaryString,
  shipping: toMonetaryString
})
// or add single
product.format('price', toMonetaryString)

// assign multiple observers
product.observe({
  price: updateElementById('price'),
  total: updateElementById('total'),
  shipping: updateElementById('shipping')
})
// or add single
product.observe('qty', updateElementById('qty'))


console.log(product.price) // "15,00 €"
product.price = 20;
console.log(product.price) // "20,00 €"
console.log(product.total) // "45,00 €"
```
