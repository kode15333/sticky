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

    getStickyInfo(id: number) {
        return this.getStickies().find(sticky => sticky.id === id);
    }
}

export default App;
