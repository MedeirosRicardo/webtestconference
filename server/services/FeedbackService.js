var fs = require('fs');
var util = require('util');

var readFile = util.promisify(fs.readFile);
var writeFile = util.promisify(fs.writeFile);

class FeedbackService {
    constructor(datafile) {
        this.datafile = datafile;
    }

    async addEntry(name, title, message) {
        var data = await this.getData();
        data.unshift({name, title, message});
        return writeFile(this.datafile, JSON.stringify(data));
    }

   async getList () {
       var data = await this.getData();
       return data;
   }

    async getData() {
        var data = await readFile(this.datafile, 'utf-8');
        if(!data) return [];
        return JSON.parse(data);
    }
}

module.exports = FeedbackService;