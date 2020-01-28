import Reactive from '../src/reactive'

const updateElementById = id => html => document.getElementById(id).innerHTML = html
const elementContent = id => document.getElementById(id).textContent

test('computed props are reactive', async () => {
  document.body.innerHTML = `
    <span id="total"></span>
  `

  const product = new Reactive({
    qty: 1,
    price: 15,
    total: ({ qty, price }) => qty * price
  })

  product.observe('total', updateElementById('total'));

  expect(elementContent('total')).toEqual('15');
  product.qty = 2;
  expect(elementContent('total')).toEqual('30');
})

test('computed props passed to computed props are resolved', async () => {
  document.body.innerHTML = `
    <span id="total"></span>
  `

  const product = new Reactive({
    qty: 1,
    price: 15,
    shipping: ({ qty }) => qty > 1 ? 0 : 5,
    total: ({ qty, price, shipping }) => qty * price + shipping
  })

  product.observe('total', updateElementById('total'));

  expect(elementContent('total')).toEqual('20');
  product.qty = 2;
  expect(elementContent('total')).toEqual('30');
})

test('prevent setting value on computed props', async () => {
  document.body.innerHTML = `
    <span id="total"></span>
  `

  const product = new Reactive({
    qty: 1,
    price: 15,
    total: ({ qty, price }) => qty * price
  })

  product.observe('total', updateElementById('total'));

  expect(elementContent('total')).toEqual('15');
  product.total = 200;
  expect(elementContent('total')).toEqual('15');
})
