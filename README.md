# reactive-object
[![Latest Stable Version](https://img.shields.io/npm/v/@matejsvajger/reactive-object.svg)](https://www.npmjs.com/package/@matejsvajger/reactive-object)
[![NPM Downloads](https://img.shields.io/npm/dm/@matejsvajger/reactive-object.svg)](https://www.npmjs.com/package/@matejsvajger/reactive-object)
[![dependencies Status](https://david-dm.org/matejsvajger/reactive-object/status.svg)](https://david-dm.org/matejsvajger/reactive-object)

## Simple lightweight reactive object in vanilla js
Useful when you need to quickly drop in some simple reactivity.

### Installation
__Yarn__ || __NPM__
```sh
$ yarn add @matejsvajger/reactive-object
$ npm i @matejsvajger/reactive-object --save
```

__CDN__
```html
<script src="https://unpkg.com/@matejsvajger/reactive-object@1.0.5/dist/reactive.umd.js"></script>
```

### Usage
```js
import Reactive from '@matejsvajger/reactive-object'

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
