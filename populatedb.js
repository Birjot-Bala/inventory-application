#! /usr/bin/env node

console.log('This script populates some test items and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

import Item from './models/item.js';
import Category from './models/category.js';

// Connect to DB
import mongoose from 'mongoose';
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err => console.log(err));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('Connected to DB')
    createCategories()
        .then(() => createItems())
        .then(() => mongoose.connection.close())
        .catch(err => console.log('FINAL ERR: ' + err));
});

const items = [];
const categories = [];

function createCategory(categoryName, desc) {
    const category = new Category({
        name: categoryName,
        desc: desc
    });

    return category
        .save()
        .then(() => {
            console.log('New Category: ' + category);
            categories.push(category);
        }).catch(err => console.log('ERROR CREATING category: ' + category));
}

function createItem(itemName, desc, category, price, stock) {
    const item = new Item({
        name: itemName,
        desc: desc,
        category: category,
        price: price,
        stock: stock
    });

    return item
        .save()
        .then(() => {
            console.log('New Item: ' + item);
            items.push(item);
        }).catch(err => console.log('ERROR CREATING item: ' + item));
}

function createCategories() {
    return Promise.all([
        createCategory('Baked Goods', 'Freshly baked goods that will leave your sweet tooth satisfied.'),
        createCategory('Burgers', 'Variety of burgers for every type of person!'),
        createCategory('Sides', 'Accompany your main with classic sides!'),
    ]).then(() => console.log("Succesfully created categories"))
        .catch(err => {
            console.error(err);
        });
}

function createItems() {
    return Promise.all([
        createItem('Donut', 'Classic glazed donut.', categories[0], '0.75', 12),
        createItem('Carrot Muffin', 'Muffin made from fresh carrots', categories[0], '0.75', 15),
        createItem('Cupcake', 'Vanilla frosting cupcake!', categories[0], '0.50', 30),
        createItem('Vege Burger', '100% vegetarian burger with a plant-based patty.', categories[1], '5.00', 24),
        createItem('Classic Beef Burger', 'Tried and tested burger.', categories[1], '5.00', 50),
        createItem('Fries', 'Classic cut fries.', categories[2], '1.00', 50),
        createItem('Mashed Potatoes', 'Famous mashed potatoes with gravy', categories[2], '2.00', 40)
    ]).then(() => console.log('Successfully created items'))
        .catch(err => {
            console.error(err);
        });
}

// Carry out creation in series as items depend on categories.
