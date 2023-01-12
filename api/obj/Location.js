class Location {

    /**
     * X coordinate for this location
     * @type {number}
     */
    x;

    /**
     * Y coordinate for this location
     * @type {number}
     */
    y;

    /**
     * Z coordinate for this location
     * @type {number}
     */
    z;

    /**
     * Location constructor
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

}

module.exports = Location;