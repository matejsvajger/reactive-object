import Reactive from '../src/reactive'

const updateElementById = id => html => document.getElementById(id).innerHTML = html
const toMonetaryString = num => `${num.toFixed(2).replace('.', ',')} €`;
const elementContent = id => document.getElementById(id).textContent
const getTax = (price, tax) => toMonetaryString(price - (price * 100) / (100 + tax))

test('formated property passed to observer', async () => {
  document.body.innerHTML = `
    <span id="price"></span>
  `

  const product = new Reactive({
    price: 15
  })

  product.observe('price', updateElementById('price'));
  product.format('price', toMonetaryString);

  expect(elementContent('price')).toEqual('15,00 €');
  product.price = 10;
  expect(elementContent('price')).toEqual('10,00 €');
})

test('observer updated after formatter is applied', async () => {
  document.body.innerHTML = `
    <span id="price"></span>
  `

  const product = new Reactive({
    price: 15
  })

  product.observe('price', updateElementById('price'));

  expect(elementContent('price')).toEqual('15');
  product.format('price', toMonetaryString);
  expect(elementContent('price')).toEqual('15,00 €');
})

test('setup multiple formatters at once', async () => {
  document.body.innerHTML = `
    <span id="price"></span>
    <span id="qty"></span>
  `
  const product = new Reactive({
    price: 15,
    qty: 1
  })

  product.observe({
    'qty': updateElementById('qty'),
    'price': updateElementById('price'),
  });

  product.format({
    'qty': qty => `${qty} ${qty == 1 ? 'item' : 'items'}`,
    'price': toMonetaryString,
  });

  expect(elementContent('qty')).toEqual('1 item');
  expect(elementContent('price')).toEqual('15,00 €');

  product.qty = 2
  product.price = 10

  expect(elementContent('qty')).toEqual('2 items');
  expect(elementContent('price')).toEqual('10,00 €');
})

test('formatters recieve dry resolved values', async () => {
  document.body.innerHTML = `
    <span id="total"></span>
    <span id="tax"></span>
  `

  const product = new Reactive({
    qty: 1,
    price: 15,
    total: ({ qty, price }) => qty * price
  })

  product.observe('total', updateElementById('total'));
  product.format('price', toMonetaryString);
  product.format('total', toMonetaryString);

  expect(elementContent('total')).toEqual('15,00 €');
  product.qty = 2;
  expect(elementContent('total')).toEqual('30,00 €');

  product.observe('tax', updateElementById('tax'))
  product.format('tax', (tax, { total }) => getTax(total, tax))
  product.tax = () => 20

  expect(elementContent('tax')).toEqual('5,00 €');
})
