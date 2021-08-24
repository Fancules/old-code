const crt = document.querySelector('#cart');
const dates = document.querySelectorAll(".date");

const formatDate = function(d) {
    return new Intl.DateTimeFormat({
        day: "numeric",
        month: "numeric",
        year: "2-digit"
    }).format(new Date(d));
}

dates.forEach(d => {
    d.textContent = formatDate(d.textContent);
});

if (crt) {
    crt.addEventListener('click', e => {
        e.preventDefault();

        if (e.target.classList.contains('rem')) {

            const id = e.target.dataset.id;
            const csrf = e.target.dataset.csrf;

            fetch('cart/remove/' + id, {
                    method: 'delete',
                    headers: {
                        'X-XSRF-Token' : csrf
                    },
                }).then(response => response.json())
                .then(data => {
                    if (data.teams.length > 0) {
                        const html = data.teams.map(c => {
                            return `
                            <tr>
                                <td>${c.team}</td>
                                <td>${c.estDate}</td>
                                <td>${c.count}</td>
                                <td>
                                    <button class='btn-small rem' data-id='${c._id}'>Remove</button>
                                </td>
                            </tr>
                            `
                        }).join('');
                        document.querySelector('tbody').innerHTML = html;
                    } else {
                        document.querySelector('#cart').innerHTML = "<p>Shopping cart is empty</p>";
                    }
                });
        }
    });
}

M.Tabs.init(document.querySelectorAll('.tabs'));
