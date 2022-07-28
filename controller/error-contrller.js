const fs = require('fs');

class ErrorController {
    showError404Page(req,res) {
        fs.readFile('views/error-404.html', 'utf-8', (err, data) => {
            if(err){
                throw new Error(err.message)
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            }
        });
    }
}
module.exports = ErrorController;