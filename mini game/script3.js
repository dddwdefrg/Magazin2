let total = 0;
$(document).ready(function () {
    let budjet = Math.floor(Math.random() * (10000001 - 50000) + 50000);
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
        } else if($('.cart-list').length === 0){
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

    total += price;

    $('.cart-list').append(`
        <div class="cart-item" data-price="${price}">
            <img src="${img}" width="40" height="40" style="border:2px solid black; border-radius:8px;"> |
            ${name} | ${price} грн | <span class="del" style="cursor:pointer;">🗑️</span>
        </div>
    `);

    $('.zag').text(`Общая стоимость: ${total} грн`);
});
$('.cart-list').on('click', '.del', function () {

    let item = $(this).closest('.cart-item');
    let price = parseInt(item.data('price'));

    total -= price;

    item.remove();
    alertify.success("Deleted")
    if (total <= 0) {
        total = 0;
        $('.zag').text(' ');
    } else {
        $('.zag').text(`Общая стоимость: ${total} грн`);
    }
});
$('.clear-cart').click(function () {
    $('.cart-list').empty();
    total = 0;
    $('.zag').text(' ');
});



