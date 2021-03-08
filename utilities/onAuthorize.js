const success = (data, accept) => {
    console.log('successful connection to socket.io');
    accept(null, true);
}

const fail = (data, message, error, accept) => {
    if (error) throw new Error(message);
    console.log('failed connection to socket.io:', message);
    accept(null, false);
}

module.exports = {success, fail}
