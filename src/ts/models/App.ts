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

    getFolder(id: number) {
        return this.getFolders().find(f => f.id === id) || Folder.get();
    }

    getFolders() {
        return Array.from(super.values());
    }
}

export default App;
