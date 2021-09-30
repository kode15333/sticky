import Folder from './Folder';

class App extends Set<Folder> {
    static load(json: Folder[]) {
        const app = new App();
        json.forEach(f => {
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

    getFolders() {
        return Array.from(super.values());
    }
}

export default App;
