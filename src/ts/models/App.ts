import Folder from './Folder';

class App extends Set<Folder> {
    static load(json: Folder[]) {
        const app = new App();
        json.forEach(f => {
            // @ts-ignore
            app.addFolder(Folder.load(f));
        });

        return app;
    }

    toJSON() {
        return this.getFolders();
    }

    addFolder(folder: Folder) {
        super.add(folder);
    }

    getFolder(id = 1) {
        return this.getFolders().find(f => f.id === id) || Folder.get();
    }

    getFolders() {
        return Array.from(super.values());
    }

    getNewId() {
        let newId = 0;

        this.getFolders()
            .map(folder => folder.id)
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
}

export default App;
