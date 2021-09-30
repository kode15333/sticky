import Sticky from './Sticky';

class Folder {
    private stickies: Set<Sticky> = new Set<Sticky>();

    constructor(public id = '', public name = '') {
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

    static get(id = '', name = '') {
        return new Folder(id, name);
    }

    addSticky(sticky: Sticky) {
        this.stickies.add(sticky);
    }

    removeSticky(sticky: Sticky) {
        this.stickies.delete(sticky);
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
