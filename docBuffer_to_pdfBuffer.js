const tmp = require('temporary')
const fs = require('fs')
const path = require('path');
const exec = require('child_process').exec;

module.exports = (buffer) => {

    return new Promise(function (resolve, reject) {

        var file = new tmp.File()
        var outdir = new tmp.Dir()
        file.writeFile(buffer, (err) => {

            if (err) reject(err)
            const cmd = 'soffice --headless --convert-to pdf ' + file.path + ' --outdir ' + outdir.path;

            exec(cmd, function (error, stdout, stderr) {
                if (error) {
                    reject(error)
                } else {
                    let i = 0
                    let clear = setInterval(function () {
                        i++
                        if (fs.existsSync(path.join(outdir.path, path.basename(file.path, path.extname(path.basename(file.path))) + ".pdf"))) {
                            fs.readFile(path.join(outdir.path, path.basename(file.path, path.extname(path.basename(file.path))) + ".pdf"), (err, buffer) => {
                                if (err) {
                                    reject(err)
                                    clearInterval(clear)
                                }
                                resolve(buffer)
                                clearInterval(clear)
                            })
                        }
                    }, 300);
                }
            });
        })
    });

}
