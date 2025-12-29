let budgetBonusAdded = false;
const products = [...document.querySelectorAll(".name")]
    .map(el => el.textContent.trim());

let total = 0;

function getListItems() {
    return $('.listtt li').map(function () {
        return $(this).text().trim();
    }).get();
}

function getCartItems() {
    return $('.cart-item').map(function () {
        return $(this).data('name');
    }).get();
}
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


function compareListAndCart(budget, total) {
    const listItems = getListItems();
    const cartItems = getCartItems();

    const missing = listItems.filter(item => !cartItems.includes(item));
    const extra = cartItems.filter(item => !listItems.includes(item));

    const allBought = missing.length === 0;
    const budgetEnough = total <= budget;

    return { listItems, cartItems, missing, extra, allBought, budgetEnough };
}

$(document).ready(function () {
    let budjet = Math.floor(Math.random() * (10000001 - 500000) + 500000);
    $('.bud').text("Твой бюджет: " + budjet);
    let x = Math.floor(Math.random() * 8) + 1
    let y;
    for (let i = 0; i < x; i++) {
        y = Math.floor(Math.random() * 90);
        $('.listtt').append(`<li>${products[y]}</li>`);
    }
    checkAndAddBudgetBonus();
    function checkAndAddBudgetBonus() {
        if (budgetBonusAdded) return;

        let listTotal = 0;

        $('.listtt li').each(function () {
            const name = $(this).text().trim();

            // ищем карточку товара по имени
            const card = $('.card').filter(function () {
                return $(this).find('.name').text().trim() === name;
            });

            if (card.length) {
                const price = parseInt(card.find('.cost').text());
                listTotal += price;
            }
        });

        if (budjet < listTotal) {
            budjet += 50000;
            budgetBonusAdded = true;

            $('.bud').text("Твой бюджет: " + budjet);

            alertify.message('⚠️ Бюджет был увеличен на 50 000');
        }
    }
    $('#promo').change(function () {
        if ($('#promo').val() == "АРМЕН ПУШКА") {
            budjet = 999999999999999999999;
            $('.bud').text("Твой бюджет: " + budjet);
        } else {
            alert("Нэт");
        }
    });

    $('.buy-all').click(function () {

        const result = compareListAndCart(budjet, total);
        let message = "";

        // Зелений фон = успіх
        function successScreen(text) {
            $('body').css({
                background: '#58d05e',   // Зелений
                color: '#000',
                transition: '0.4s'
            });

            $('#cart, .list, .products-container').remove(); // ховаємо інтерфейс (заміни селектори під себе)

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

            $('#cart, .list, .products-container').remove();

            $('body').append(`
            <div class="finish-message" style="
                font-size: 32px;
                padding: 30px;
                text-align: center;
                font-weight: bold;
            ">${text}</div>
        `);
        }

        // ЛОГІКА ПЕРЕВІРКИ

        // Увесь список куплено?
        const all = result.allBought;

        // Бюджет ок?
        const bud = result.budgetEnough;

        // Є зайві продукти?
        const extra = result.extra.length > 0;

        // Є пропущені продукти?
        const missing = result.missing.length > 0;


        // -------- УСПІШНІ ВИПАДКИ --------

        // 1. Усе куплено, бюджет не перевищено, без зайвих
        if (all && bud && !extra) {
            successScreen(`Бюджет не перевищено ✔  
Усе куплено за списком!`);
            return;
        }

        // 2. Усе куплено, бюджет ок, але куплено зайві товари
        if (all && bud && extra) {
            successScreen(`Бюджет не перевищено ✔  
Але ти купив зайве:  
${result.extra.join(', ')}`);
            return;
        }


        // -------- ПОМИЛКИ / НЕВДАЛІ ВИПАДКИ --------

        let errorText = "Є проблеми:\n\n";

        if (!all) {
            errorText += `• Не куплено: ${result.missing.join(', ')}\n`;
        }

        if (!bud) {
            errorText += `• Бюджет перевищено (потрібно ${total}, було ${budjet})\n`;
        }

        if (extra) {
            errorText += `• Куплено зайве: ${result.extra.join(', ')}\n`;
        }

        errorScreen(errorText.replace(/\n/g, '<br>'));
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



