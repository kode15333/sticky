import App from './App';
import Renderer from './Renderer';
import Sticky from './models/Sticky';

const STICKY_LS = 'sticky_storage';

class DOMRenderer extends Renderer {
    private $wrapper: HTMLElement;

    constructor(private parent: Document, public app: App) {
        super(app);
        if (!localStorage[STICKY_LS]) {
            localStorage[STICKY_LS] = JSON.stringify([]);
            this.app.addStickies(Sticky.get());
        } else {
            this.app = App.load(JSON.parse(localStorage[STICKY_LS]));
        }

        this.$wrapper = parent.querySelector('#stickWrap')!;
        this.render();
    }

    _render() {
        console.log('render tasks');
        const stickies: Sticky[] = this.app.getStickies();
        stickies.forEach(sticky => {
            this.createSticky(sticky);
        });
    }

    createSticky(sticky: Sticky) {
        const { id, top, left, zIndex, text } = sticky;
        const html = `<div
                class="sticky"
                id="${id}"
                style="
                    top: ${`${top}px`};
                    left: ${`${left}px`};
                    z-index: ${zIndex};">
                <nav class="side_nav">
                    <ol></ol>
                </nav>
                <nav class="top_nav">
                    <a class="add">
                        <i class="fa fa-plus"></i>
                    </a>
                    <a class="save">
                        <i class="fa fa-floppy-o"></i>
                    </a>
                    <div class="right">
                        <a class="get">
                            <i class="fa fa-list"></i>
                        </a>
                        <a class="del">
                            <i class="fa fa-times"></i>
                        </a>
                    </div>
                </nav>
                <textarea name="txt" class="txt">${text}</textarea>
            </div>`;
        this.$wrapper.insertAdjacentHTML('beforeend', html);
    }
}
new DOMRenderer(document, new App());
