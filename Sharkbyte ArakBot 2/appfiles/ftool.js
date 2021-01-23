module.exports = {
    exists: (filename) => {
        return new Promise((allok, notuse) => {
            try {
                require("fs").exists(filename, (ex) => {
                    allok(ex);
                });
            } catch (e) {
                allok(false);
            }
        })
    },
    path: require("path"),
    giar: (ar, tf) => {
        return ar.findIndex((cit) => cit.master == tf);
    },
    ymd: require("youtube-meta-data"),
    logx: require("shark-logger-remote")
};