import Memo from '~/ts/Memo';

class App extends Set {
    static load(json: Memo[]) {
        const app = new App();
        json.forEach(f => {
            app.addMemo(Memo.load(f));
        });

        return app;
    }

    addMemo(memo: Memo) {
        super.add(memo);
    }

    removeMemo(memo: Memo) {
        super.delete(memo);
    }

    getMemos() {
        return Array.from(super.values());
    }
}

export default App;
