import Sticky from './models/Sticky';

class App extends Set<Sticky> {
    static load(json: Sticky[]) {
        const app = new App();
        json.forEach(f => {
            app.addStickies(Sticky.load(f));
        });

        return app;
    }

    toJSON() {
        return this.getStickies();
    }

    addStickies(sticky: Sticky) {
        super.add(sticky);
    }

    removeSticky(sticky: Sticky) {
        super.delete(sticky);
    }

    getStickies() {
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
}

export default App;
