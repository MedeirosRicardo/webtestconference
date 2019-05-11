var fs = require('fs');
var util = require('util');

var readFile = util.promisify(fs.readFile);

class SpeakerService {
    constructor(datafile) {
        this.datafile = datafile;
    }

    async getNames() {
        var data = await this.getData();

        return data.map((speaker) => {
            return { name: speaker.name, shortname: speaker.shortname };
        });
    }

    async getListShort() {
        var data = await this.getData();
        return data.map((speaker) => {
            return { name: speaker.name, shortname: speaker.shortname, title: speaker.title };
        });
    }

    async getList() {
        var data = await this.getData();
        return data.map((speaker) => {
            return { name: speaker.name, shortname: speaker.shortname, title: speaker.title, summary: speaker.summary };
        });
    }

    async getAllArtwork() {
        var data = await this.getData();
        var artwork = data.reduce((acc, elm) => {
            if(elm.artwork) {
                acc = [...acc, ...elm.artwork];
            }
            return acc;
        }, []);
        return artwork;
    }

    async getSpeaker(shortname) {
        var data = await this.getData();
        var speaker = data.find((speaker) => {
            return speaker.shortname === shortname;
        });
        if(!speaker) return null;
        return {
            title: speaker.title,
            name: speaker.name,
            shortname: speaker.shortname,
            description: speaker.description,
        }
    }

    async getArtworkForSpeaker(shortname) {
        var data = await this.getData();
        var speaker = data.find((speaker) => {
            return speaker.shortname === shortname;
        });
        if(!speaker || !speaker.artwork) return null;
        return speaker.artwork;
    }

    async getData() {
        var data = await readFile(this.datafile, 'utf-8');
        if(!data) return [];
        return JSON.parse(data).speakers;
    }
}

module.exports = SpeakerService;