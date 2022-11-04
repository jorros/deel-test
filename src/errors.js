class DeelError extends Error
{
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}

const ErrorCodes = {
    CLIENT_NOT_FOUND: 'CLIENT_NOT_FOUND',
    TOO_HIGH_AMOUNT: 'TOO_HIGH_AMOUNT',
    JOB_NOT_FOUND: 'JOB_NOT_FOUND',
    JOB_ALREADY_PAID: 'JOB_ALREADY_PAID',
    CLIENT_NOT_ENOUGH_BALANCE: 'CLIENT_NOT_ENOUGH_BALANCE'
}

module.exports = {DeelError, ErrorCodes};