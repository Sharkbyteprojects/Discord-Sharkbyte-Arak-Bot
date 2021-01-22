module.exports = (t, c) => {
    return () => {
        try {
            t();
        } catch (e) {
            c(e);
        }
    };
}