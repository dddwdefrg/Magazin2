let total = 0;

document.querySelectorAll(".card").forEach(card => {
    const buyBtn = card.querySelector(".buy");
    if (!buyBtn) return;

    const qtyBlock = document.createElement("div");
    qtyBlock.className = "qty";
    qtyBlock.innerHTML = `
        <button class="qty-minus">−</button>
        <span class="qty-value">1</span>
        <button class="qty-plus">+</button>
    `;

    buyBtn.before(qtyBlock);
});

$(document).ready(function () {
    let budjet = Math.floor(Math.random() * (10000001 - 500000) + 500000);
    $('.bud').text("Хз какой бюджет наверное много");
    $('#promo').change(function () {
        if ($('#promo').val() == "АРМЕН ПУШКА") {
            $('.bud').text("Все равно хз");
        } else {
            alert("Так а толку от промокода то даун");
        }
    });

    $('.buy-all').click(function () {

        let message = "";

        // Зелений фон = успіх
        function successScreen(text) {
            $('body').css({
                background: '#58d05e',   // Зелений
                color: '#000',
                transition: '0.4s'
            });

            $('#cart, .products, .bud').remove(); // ховаємо інтерфейс (заміни селектори під себе)

            $('body').append(`
            <div class="finish-message" style="
                font-size: 32px;
                padding: 30px;
                text-align: center;
                font-weight: bold;
            ">${text}</div>
        `);
        }

        // Червоний фон = помилка
        function errorScreen(text) {
            $('body').css({
                background: '#ff4a4a',   // Червоний
                color: '#fff',
                transition: '0.4s'
            });

            $('#cart, .products, .bud').remove();

            $('body').append(`
            <div class="finish-message" style="
                font-size: 32px;
                padding: 30px;
                text-align: center;
                font-weight: bold;
            ">${text}</div>
        `);
        }


        // -------- УСПІШНІ ВИПАДКИ --------


        if (total <= budjet) {
            successScreen(`Ну короче твой бюджет был ${budjet} а ты потратил всего ${total}, ну типо молодец хорош красавчик`);
            return;
        }




        // -------- ПОМИЛКИ / НЕВДАЛІ ВИПАДКИ --------

        if (total > budjet) {
            errorScreen(`Ну короче ты проиграл потому что из ${budjet} ты потратил ${total}, это аж на ${total - budjet} больше`);
            return;
        }

    });

});
$('#cart-button').click(function () {
    $('#cart-products').slideToggle();
});
$('.buy').click(function () {
    let card = $(this).closest('.card');
    let name = card.find('.name').text();
    let price = parseInt(card.find('.cost').text());
    let img = card.find('.img').attr("src");

    // 👉 количество с карточки
    let qty = parseInt(card.find('.qty-value').text());

    // 👉 проверяем: товар уже есть в корзине?
    let existing = $('.cart-item').filter(function () {
        return $(this).data('name') === name;
    });

    if (existing.length) {
        // если уже есть — увеличиваем количество
        let newQty = existing.data('qty') + qty;
        existing.data('qty', newQty);
        existing.find('.cart-qty').text(newQty);
        existing.find('.cart-name').text(name + ' (' + newQty + ')');
    } else {
        // если нет — создаём новый
        $('.cart-list').append(`
           <div class="cart-item"
         data-name="${name}"
         data-price="${price}"
         data-qty="${qty}">
         
        <img src="${img}" width="40" height="40">
        <span class="cart-name">${name}</span>

        <button class="cart-minus">−</button>
        <span class="cart-qty">${qty}</span>
        <button class="cart-plus">+</button>

        <span class="cart-sum">${price * qty} грн</span>
        <span class="del">🗑️</span>
    </div>
        `);
    }

    total += price * qty;
    $('.zag').text(`хз сколько`);
});
$('.cart-list').on('click', '.cart-plus', function () {
    let item = $(this).closest('.cart-item');

    let price = item.data('price');
    let qty = item.data('qty') + 1;

    item.data('qty', qty);
    item.find('.cart-qty').text(qty);
    item.find('.cart-sum').text(price * qty + ' грн');

    total += price;
    $('.zag').text(`хз сколько`);
});
$('.cart-list').on('click', '.cart-minus', function () {
    let item = $(this).closest('.cart-item');

    let price = item.data('price');
    let qty = item.data('qty');

    if (qty === 1) {
        alert('Минимальное количество — 1');
        return;
    }

    qty--;
    item.data('qty', qty);
    item.find('.cart-qty').text(qty);
    item.find('.cart-sum').text(price * qty + ' грн');

    total -= price;
    $('.zag').text(`хз сколько`);
});

$(document).on('click', '.qty-plus', function () {
    let qtyEl = $(this).siblings('.qty-value');
    let qty = parseInt(qtyEl.text()) + 1;
    qtyEl.text(qty);
});

$(document).on('click', '.qty-minus', function () {
    let qtyEl = $(this).siblings('.qty-value');
    let qty = parseInt(qtyEl.text());

    if (qty === 1) return;
    qtyEl.text(qty - 1);
});
$('.cart-list').on('click', '.del', function () {

    let item = $(this).closest('.cart-item');
    let price = parseInt(item.attr('data-price'));
    let qty = parseInt(item.attr('data-qty'));

    alertify.confirm('Вы уверены? Товар будет удален из корзины')
        .set('onok', function () {
            alertify.success('Удалено');

            // Уменьшаем total
            total -= price * qty;
            if (total < 0) total = 0;

            // Удаляем элемент
            item.remove();

            // Обновляем текст
            $('.zag').text(total > 0 ? `Хз сколько` : '');
        })
        .set('oncancel', function () {
            alertify.error('Отменено');
        });
});
$('.clear-cart').click(function () {
    alertify.confirm('Вы уверены? Все товары будут удалены из корзины')
        .set('onok', function () {
            alertify.success('Корзина очищена');
            $('.cart-list').empty();
            total = 0;
            $('.zag').text(' ');
        })
        .set('oncancel', function () {
            alertify.error('Очистка отменена');
        });
});



