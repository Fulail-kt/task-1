const prompt = require('prompt-sync')();

//PRODUCTS
const products = {
    "A": 20,
    "B": 40,
    "C": 50
};

// STORE THE PRODUCTS
const selected = {};

while (true) {

    let product = prompt('Choose a product (A, B, C) or enter "done" to finish: ');
    if (product.toLowerCase() === 'done') {
        break;
    }
    product = product.toUpperCase()
    let quantity = parseInt(prompt('Enter the quantity'));

    let GiftWrap = prompt(`Do you want to wrap the product? (y/n): `)
    GiftWrap = GiftWrap.toLowerCase() == 'y' ? quantity * 1 : 0

    if (products.hasOwnProperty(product) && quantity > 0) {
        if (selected.hasOwnProperty(product)) {
            selected[product[0]] += quantity;
        } else {
            selected[product] = [quantity, GiftWrap]
        }

        console.log(`selected ${quantity} of ${product}. gift wrap : ${GiftWrap?"Yes":"No"}`)

    } else {
        console.log('Invalid input. Please choose a valid product and quantity.');
    }
}

// CALCULATE CART TOTAL

const cartTotal = (selected, products) => {
    let total = 0
    for (let product in selected) {
        total = total + selected[product][0] * products[product];
    }
    return total
}

// DISCOUNT RULES

const discountCalc = (total, selected) => {
    // if cart total is above 200$ flat 10 off

    let discount;

    if (total > 200) {
        discount=10
        return {discount,discountName:"flat_10_discount"}
    }

    // if the each product quantity price is above 10 5%off
    for (let prd in selected) {
        if (selected[prd] > 10) {
            discount=products[prd] * selected[prd] * 0.05
            return {discount,discountName:"bulk_5_discount"}
        }
    }

    // if the cart total quantiy is above 20 10%off
    if (Object.values(selected).reduce((acc, val) => acc + val, 0) > 20) {
        discount=total * 0.1
        return {discount,discountName:"bulk_10_discount"}
    }

    // if quanity of each product is above 15 50%off
    const prdAbove15 = Object.entries(selected).find(([product, quantity]) => quantity > 15);
    if (total > 30 && prdAbove15) {
      
         discount=products[prdAbove15[0]] * prdAbove15[1] * 0.5
         return {discount,discountName:"tiered_50_discount"}
    }

    return 0;
};

// SHIPPING AND GIFT WRAP AMOUNT

const totalShippingAndgiftWrap = (selected) => {
    // calculate total quantity
    let totalQuantity = Object.values(selected).reduce((acc, val) => acc + val[0], 0);

    // divide shipping amount
    let shippingFee = Math.ceil(totalQuantity / 10) * 5;

    // total gift wrap amount
    let totalGift = Object.values(selected).reduce((acc, val) => acc + val[1], 0);

    return { shippingFee, totalGift };
}


const total = cartTotal(selected, products);
const { shippingFee, totalGift } = totalShippingAndgiftWrap(selected)
const {discount,discountName} = discountCalc(total, selected)
const finalAmount = total - discount + shippingFee + totalGift;

console.log(`\n subTotal amount ${total}`)

console.log(`\n Gift wrap fee + ${totalGift}`)

console.log(`\n Shipping fee + ${shippingFee}`)

console.log(`\n Total discount - ${discount}  (${discountName})`)

console.log(`\n User have to pay ${finalAmount}`)


