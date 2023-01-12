class PayoutInformation {

    /**
     * Payout Krist address
     * @type {string}
     */
    address;

    /**
     * Payout frequency option
     * @type {"payout"|"transaction"|"daily"}
     */
    frequency;

    /**
     * Payout setpoint, if the frequency option is set to "payout", otherwise null
     * @type {number?}
     */
    setpoint;

    constructor(address, frequency, setpoint) {
        this.address = address;
        this.frequency = frequency;
        this.setpoint = setpoint;
    }
    
}

module.exports = PayoutInformation;
