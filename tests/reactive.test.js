import Reactive from '../src/reactive'

const updateElementById = id => html => document.getElementById(id).innerHTML = html
const elementContent = id => document.getElementById(id).textContent

test('object sets reactive properties on instantiation', async () => {
  document.body.innerHTML = `
    <span id="qty"></span>
  `

  const product = new Reactive({ qty: 1 })
  product.observe('qty', updateElementById('qty'));

  expect(elementContent('qty')).toEqual('1');
  product.qty = 2;
  expect(elementContent('qty')).toEqual('2');
})

test('object sets reactive properties when observed', async () => {
  document.body.innerHTML = `
    <span id="qty"></span>
  `

  const product = new Reactive

  product.observe('qty', updateElementById('qty'));
  product.qty = 1

  expect(elementContent('qty')).toEqual('1');
  product.qty = 2;
  expect(elementContent('qty')).toEqual('2');
})

test('setup multiple observers at once', async () => {
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

  expect(elementContent('qty')).toEqual('1');
  expect(elementContent('price')).toEqual('15');

  product.qty = 2
  product.price = 10

  expect(elementContent('qty')).toEqual('2');
  expect(elementContent('price')).toEqual('10');
});

test('all observers on one property are called', async () => {
  document.body.innerHTML = `
    <span id="qty-1"></span>
    <span id="qty-2"></span>
  `
  const product = new Reactive({ qty: 1 })
  product.observe('qty', updateElementById('qty-1'));
  product.observe('qty', updateElementById('qty-2'));

  expect(elementContent('qty-1')).toEqual('1');
  expect(elementContent('qty-2')).toEqual('1');

  product.qty = 2

  expect(elementContent('qty-1')).toEqual('2');
  expect(elementContent('qty-2')).toEqual('2');
});
