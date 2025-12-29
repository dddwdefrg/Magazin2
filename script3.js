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
    $('.bud').text("Твой бюджет: " + budjet);
    $('#promo').change(function () {
        if ($('#promo').val() == "АРМЕН ПУШКА") {
            budjet = 999999999999999999999;
            $('.bud').text("Твой бюджет: " + budjet);
        } else {
            alert("Нэт");
        }
    });

    $('.buy-all').click(function () {

        if (total <= budjet) {
            budjet -= total;
            $('.cart-list').empty();
            total = 0;
            $('.zag').text(' ');
            $('.bud').text("Твой бюджет: " + budjet);
            alertify.success(`Успешно куплено, ваша сдача ${budjet} грн, приходите еще!!`);
        } else if (total == budjet) {
            $('.cart-list').empty();
            total = 0;
            $('.zag').text(' ');
            budjet = 0;
            $('.bud').text("Ваш кошелек пуст...");
            alertify.success(`Успешно куплено, приходите еще!!`);
        } else if (total > budjet) {
            alertify.error(`Вам не хватает ${total - budjet} грн, уберите чтото из корзины`);
        } else if ($('.cart-list').length === 0) {
            alertify.error(`У тебя в корзине нету ничего даун`);
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
    $('.zag').text(`Общая стоимость: ${total} грн`);
});
$('.cart-list').on('click', '.cart-plus', function () {
    let item = $(this).closest('.cart-item');

    let price = item.data('price');
    let qty = item.data('qty') + 1;

    item.data('qty', qty);
    item.find('.cart-qty').text(qty);
    item.find('.cart-sum').text(price * qty + ' грн');

    total += price;
    $('.zag').text(`Общая стоимость: ${total} грн`);
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
    $('.zag').text(`Общая стоимость: ${total} грн`);
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
            $('.zag').text(total > 0 ? `Общая стоимость: ${total} грн` : '');
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



