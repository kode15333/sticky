import Sticky from './Sticky';

class Folder extends Set<Sticky> {
    private stickies: Sticky[] = [];

    constructor(public id = 0, public name = 'test') {
        super();
        this.id = id;
        this.name = name;
    }

    static load(json: Folder) {
        const folder = new Folder(json.id, json.name);
        json.stickies.forEach(f => {
            folder.addSticky(Sticky.load(f));
        });

        return folder;
    }

    toJSON() {
        return this.getInfo();
    }

    static get(id = 0, name = '') {
        return new Folder(id, name);
    }

    addSticky(sticky: Sticky) {
        super.add(sticky);
    }

    removeSticky(sticky: Sticky) {
        super.delete(sticky);
    }

    getStickies() {
        return Array.from(this.stickies.values());
    }

    getNewId() {
        let newId = 0;

        this.getStickies()
            .map(sticky => sticky.id)
            .sort((a, b) => a - b)
            .every(id => {
                if (newId >= id) {
                    newId = id + 1;
                    return true;
                }

                return false;
            });

        return newId;
    }

    getInfo() {
        return this;
    }
}

export default Folder;
