#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

import Item from './models/item.js';
import Category from './models/category.js';

// Connect to DB
const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const items = [];
const categories = [];

const createItem = (itemName, desc, category, price, stock) => {
    const item = new Item({
        name: itemName,
        desc: desc,
        category: category,
        price: price,
        stock: stock
    });

    // Return promise
    return (
        item
            .save()
            .then(() => {
                console.log('New Item: ' + item);
                items.push(item);
            })
    );
}

const createCategory = (categoryName, desc) => {
    const category = new Category({
        name: categoryName,
        desc: desc
    });

    // Return promise
    return (
        category
            .save()
            .then(() => {
                console.log('New Category: ' + category);
                categories.push(category);
            })
    );
}

const createCategories = async () => {
    Promise.all([
        createCategory('Baked Goods', 'Freshly baked goods that will leave your sweet tooth satisfied.'),
        createCategory('Burgers', 'Variety of burgers for every type of person!'),
        createCategory('Sides', 'Accompany your main with classic sides!'),
    ]).then(() => console.log("Succesfully created categories"))
    .catch(err => {
        console.error(err);
    })
}

const createItems = async () => {
    Promise.all([
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
    })
}

// Carry out creation in series as items depend on categories.
await createCategories();
await createItems();

// Completed. Disconnect from database.
mongoose.connection.close();
