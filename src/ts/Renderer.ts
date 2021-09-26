import App from './App';

class Renderer {
    constructor(public app: App) {
        this.app = app;
    }

    render() {
        this._render();
    }

    _render() {
        console.log('must be override');
    }
}

export default Renderer;
