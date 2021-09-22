// eslint-disable-next-line max-classes-per-file

import App from './App';
import { STICKY_LS } from '../util/constant';
import Memo from './Memo';

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

class DOMRenderer extends Renderer {
    private $wrapper: HTMLElement;

    constructor(private parent: Document, public app: App) {
        super(app);
        if (localStorage[STICKY_LS]) {
            this.app = App.load(JSON.parse(localStorage[STICKY_LS]));
        } else {
            localStorage[STICKY_LS] = JSON.stringify([]);
        }

        this.$wrapper = parent.querySelector('#stickWrap')!;
        this.render();
    }

    _render() {
        console.log('render tasks');
        const memos: Memo[] = this.app.getMemos();

        memos.forEach(memo => {
            this.createMemo(memo);
        });

        localStorage[STICKY_LS] = JSON.stringify(this.app.getMemos());
    }

    createMemo(memo: Memo) {
        const { id, top, left, zIndex, text } = memo;
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
