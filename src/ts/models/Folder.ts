import Sticky from './Sticky';

type FolderJSON = {
    id: number;
    name: string;
    stickies: Sticky[];
};
class Folder extends Set<Sticky> {
    constructor(public id = 0, public name = 'test') {
        super();
        this.id = id;
        this.name = name;
    }

    static load(json: FolderJSON) {
        const folder = new Folder(json.id, json.name);
        json.stickies.forEach(f => {
            folder.addSticky(Sticky.load(f));
        });

        return folder;
    }

    toJSON() {
        return this.getInfo();
    }

    static get(id = 1, name = 'New Folders0') {
        return new Folder(id, name);
    }

    addSticky(sticky: Sticky) {
        super.add(sticky);
        return this;
    }

    removeSticky(sticky: Sticky) {
        super.delete(sticky);
    }

    getStickies() {
        if (super.size === 0) {
            super.add(Sticky.get());
        }
        return Array.from(super.values());
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
        const { id, name } = this;
        return {
            id,
            name,
            stickies: this.getStickies(),
        };
    }

    getId() {
        return this.id;
    }
}

export default Folder;
