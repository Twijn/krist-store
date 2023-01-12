const Shop = require("../shop");

class Product {

    /**
     * Product ID
     * @type {number}
     */
    id;

    /**
     * Shop that this product belongs to
     * @type {Shop}
     */
    shop;

    /**
     * Display name for the item
     * @type {string}
     */
    displayName;

    /**
     * Minecraft name of the item
     * @type {string}
     */
    name;

    /**
     * NBT data for the item, if present
     * @type {string?}
     */
    nbt;

    /**
     * Metaname for a product, used by other software for purchasing
     * @type {string}
     */
    metaname;

    /**
     * Price of product, x kst -> 1 item
     * @type {number}
     */
    price;

    /**
     * Constructor for a Product
     * @param {number} id 
     * @param {Shop} shop 
     * @param {string} displayName 
     * @param {string} name 
     * @param {string} nbt 
     * @param {string} metaname 
     * @param {number} price 
     */
    constructor(id, shop, displayName, name, nbt, metaname, price) {
        this.id = id;
        this.shop = shop;
        this.displayName = displayName;
        this.name = name;
        this.nbt = nbt;
        this.metaname = metaname;
        this.price = price;
    }

    /**
     * Gets the number of items received for 1 kst
     * @returns {number}
     */
    getItemsPerKST() {
        return 1 / this.price;
    }
}

module.exports = Product;