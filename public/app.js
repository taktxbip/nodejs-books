function formatNumber(text) {
  return new Intl.NumberFormat('en-US', {
    currency: 'usd',
    style: 'currency'
  }).format(text);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
    .format(new Date(date))
}


document.querySelectorAll('.price').forEach(node => {
  node.textContent = formatNumber(node.textContent);
})

document.querySelectorAll('.date').forEach(node => {
  node.textContent = formatDate(node.textContent);
})


const $cart = document.getElementById('cart');
if ($cart) {
  $cart.addEventListener('click', e => {
    if (!e.target.classList.contains('js-remove')) return;

    const { id } = e.target.dataset;
    fetch(`cart/remove/${id}`, { method: 'delete' })
      .then(res => res.json())
      .then(cart => {
        if (cart.books.length) {
          let html = '';
          cart.books.map(({ id, title, img, qty, price }) => {
            html += `
                    <tr>
                        <td>
                            <div class="card-image">
                                <img src="${img}">
                            </div>
                        </td>
                        <td><a target="_blank" class="more-link" href="/books/${id}">${title}</a></td>
                        <td>${qty}</td>
                        <td>${price}</td>
                        <td>
                            <button class="btn btn-small js-remove" data-id="${id}">Remove</button>
                        </td>
                    </tr>`;
          });
          $cart.querySelector('tbody').innerHTML = html;
          $cart.querySelector('.price').textContent = formatNumber(cart.total);
        } else {
          $cart.innerHTML = '<p>Cart is empty</p>';
        }
      });
  });
}

M.Tabs.init(document.querySelectorAll('.tabs'));