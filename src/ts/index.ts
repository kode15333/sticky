import App from './models/App';
import DOMRenderer from './DOMRenderer';

window.addEventListener('DOMContentLoaded', () => {
    new DOMRenderer(document, new App());
});
