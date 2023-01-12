const con = require("../../database");

const User = require("../user");

const Location = require("../obj/Location");
const PayoutInformation = require("../obj/PayoutInformation");

const Product = require("../obj/Product");

class Shop {

    /**
     * Surrogate ID for the shop
     * @type {number}
     */
    id;

    /**
     * URI for this shop, without the http[s?]://{domain}/shop/
     * @type {string}
     */
    link;

    /**
     * Shop owner
     * @type {User}
     */
    owner;

    /**
     * Krist name, such as twijn.kst, for this shopfront. Not used by krist.store, but may be used for configuring other shops
     * @type {string}
     */
    kristName;

    /**
     * Short line about this shop. It may explain the shop or may be used to help attract business
     * @type {string}
     */
    tagline;

    /**
     * Name of the shop
     * @type {string}
     */
    name;

    /**
     * Location of the shop in the server
     * @type {Location}
     */
    location;

    /**
     * Hex theme color for this shop, including #
     * @type {string}
     */
    themeColor;

    /**
     * Is this configured to be a remote shop (with an enderchest)?
     * @type {boolean}
     */
    remote;

    /**
     * Is this configured to be a dispensing shop (configured via other shop software)?
     * @type {boolean}
     */
    dispense;

    /**
     * Payout information for this shopfront
     * @type {PayoutInformation}
     */
    payout;

    /**
     * Constructor for a new Shop object
     * @param {number} id
     * @param {string} link 
     * @param {User} owner 
     * @param {string} kristName 
     * @param {string} tagline 
     * @param {string} name 
     * @param {Location} location 
     * @param {string} themeColor 
     * @param {boolean} remote 
     * @param {boolean} dispense 
     * @param {PayoutInformation} payout 
     */
    constructor(id, link, owner, kristName, tagline, name, location, themeColor, remote, dispense, payout) {
        this.id = id;
        this.link = link;
        this.owner = owner;
        this.kristName = kristName;
        this.tagline = tagline;
        this.name = name;
        this.location = location;
        this.themeColor = themeColor;
        this.remote = remote;
        this.dispense = dispense;
        this.payout = payout;
    }

    /**
     * Returns a list of products for this shop
     * @returns {Promise<Product[]>}
     */
    getProducts() {
        return new Promise((resolve, reject) => {
            con.query("select * from product where shop_id = ?;", [this.id], (err, res) => {
                if (!err) {
                    let products = [];

                    res.forEach(product => {
                        products = [
                            ...products,
                            new Product(
                                product.id,
                                this,
                                product.displayName,
                                product.name,
                                product.nbt,
                                product.metaname,
                                product.price
                            )
                        ]
                    });

                    resolve(products);
                } else {
                    reject(err);
                }
            });
        });
    }
}

module.exports = Shop;