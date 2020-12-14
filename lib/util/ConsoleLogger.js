console.debug = (...data) => {
    if(process.env.DEBUG != 'true') return;

    let prefix = `${process.env.TIMESTAMP == 'true' ? new Date().toLocaleString() + ' ' : ''}[DEBUG]`;
    console.log(prefix, ...data);
};

console.info = (...data) => {
    let prefix = `${process.env.TIMESTAMP == 'true' ? new Date().toLocaleString() + ' ' : ''}[INFO]`;
    console.log(prefix, ...data);
};

console.warn = (...data) => {
    let prefix = `${process.env.TIMESTAMP == 'true' ? new Date().toLocaleString() + ' ' : ''}[WARN]`;
    console.log(prefix, ...data);
};

console.error = (...data) => {
    let prefix = `${process.env.TIMESTAMP == 'true' ? new Date().toLocaleString() + ' ' : ''}[ERROR]`;
    console.log(prefix, ...data);
};