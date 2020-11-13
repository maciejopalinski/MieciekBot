console.debug = message => {
    message = `${process.env.TIMESTAMP == 'true' ? new Date().toLocaleString() + ' ' : ''}[DEBUG] ${message}`;
    console.log(message);
};

console.info = message => {
    message = `${process.env.TIMESTAMP == 'true' ? new Date().toLocaleString() + ' ' : ''}[INFO] ${message}`;
    console.log(message);
};

console.warn = message => {
    message = `${process.env.TIMESTAMP == 'true' ? new Date().toLocaleString() + ' ' : ''}[WARN] ${message}`;
    console.log(message);
};

console.error = message => {
    message = `${process.env.TIMESTAMP == 'true' ? new Date().toLocaleString() + ' ' : ''}[ERROR] ${message}`;
    console.log(message);
};