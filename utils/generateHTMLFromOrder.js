function generateHTMLFromOrder({ email, order, totalPrice }, account, id) {
  return `<h2>Уникальный номер заказа ${account}</h2>
		<h3>Код оплаты: ${id}</h2><br/>
		<em>Почта: </em>${email}<br>
		<table>
			<thead>
			<tr>
				<th>Товар</th>
				<th>Стоимость</th>
				<th>Количество</th>
				<th>Общая цена</th>
				<th>Идентификатор</th>
			</tr>
			</thead>
			<tbody>

				${order
          .map(
            o => `<tr><td>${o.title}</td>
				<td>${o.price}</td>
				<td>${o.count}</td>
				<td>${o.price * o.count}</td>
				<td>${o.id}</td></tr>`
          )
          .join('')}

			</tbody>
		</table>
		<h3>Итого стоимость: ${totalPrice}</h3>
		`
}

module.exports = generateHTMLFromOrder
