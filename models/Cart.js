const path = require('path');
const fs = require('fs');
const e = require('express');

const p = path.join(process.mainModule.path, 'data', 'cart.json');

class Cart {
    constructor() {
        this.cart = null;
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf-8', (err, content) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(content));
                }
            })
        });
    }

    static async add(book) {
        const { title, img, price, id } = book;

        const cart = await Cart.fetch();

        const indx = cart.books.findIndex(el => el.id === book.id);

        if (indx === -1) {
            cart.books.push({
                id, title, img, price,
                qty: 1
            });
        } else {
            cart.books[indx].qty++;
        }

        cart.total = Cart.calculateTotal(cart);

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
    };


    static async remove(id) {
        const cart = await Cart.fetch();

        const indx = cart.books.findIndex(el => el.id === id);

        if (cart.books[indx].qty > 1) {
            cart.books[indx].qty--;
        } else {
            cart.books = cart.books.filter(el => el.id !== id);
        }

        cart.total = Cart.calculateTotal(cart);

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(cart);
                }
            })
        });
    }

    static calculateTotal(cart) {
        let total = 0;
        cart.books.forEach(el => {
            total += +el.price * +el.qty
        });

        return total;
    }
}

module.exports = Cart