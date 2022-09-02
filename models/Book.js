const { v4 } = require('uuid');
const fs = require('fs');
const path = require('path');

class Book {
    constructor(title, price, img) {
        this.title = title;
        this.price = price;
        this.img = img;
        this.id = v4();
    }

    toJSON() {
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        };
    }

    async save() {
        const books = await Book.getAll();
        books.push(this.toJSON());

        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, '..', 'data', 'books.json'), JSON.stringify(books), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, '..', 'data', 'books.json'), 'utf-8', (err, content) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(content));
                }
            })
        })
    }
}

module.exports = Book