import App from './App';
import Renderer from './Renderer';
import Sticky from './models/Sticky';
import { makeSticky } from '../util/makeTemplate';

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

    handleAddBtn = () => {
        console.log('add');
    };

    handleSaveBtn = ({ id }: Sticky) => {
        const target = this.parent.getElementById(`${id}`) as HTMLElement;
        const { top, left, zIndex } = target.style;
        const { value: text } = target.querySelector('textarea')!;

        this.app.getStickies().forEach(sticky => {
            if (sticky.id === id) {
                sticky
                    .setPosition(
                        Number.parseInt(top, 10),
                        Number.parseInt(left, 10)
                    )
                    .setText(text)
                    .setZIndex(Number.parseInt(zIndex, 10));
            }
        });

        this.render();
    };

    handleGetBtn = (event: Event) => {
        const target = event.currentTarget as HTMLElement;
        target
            .closest('.sticky')!
            .querySelector('.side_nav')
            ?.classList.toggle('active');
    };

    handleDelBtn = (sticky: Sticky) => {
        this.app.removeSticky(sticky);
        this.render();
    };

    handleTextArea = (str: string, sticky: Sticky) => {
        console.log('st', str, sticky.getInfo());
    };

    addEvent = (el: HTMLElement, sticky: Sticky) => {
        const addBtn = el.querySelector('.add')!;
        const saveBtn = el.querySelector('.save')!;
        const getBtn = el.querySelector('.get')!;
        const delBtn = el.querySelector('.del')!;
        // const textArea = el.querySelector('textarea')!;

        addBtn.addEventListener('click', this.handleAddBtn);
        saveBtn.addEventListener('click', () => this.handleSaveBtn(sticky));
        getBtn.addEventListener('click', this.handleGetBtn);
        delBtn.addEventListener('click', () => this.handleDelBtn(sticky));
        // textArea.addEventListener('input', event => {
        //     const { value } = event.target as HTMLTextAreaElement;
        //     this.handleTextArea(value, id);
        // });
    };

    makeStickyHTML = (sticky: Sticky) => {
        const { id, top, left, text, zIndex, date } = sticky;
        const $div = document.createElement('div');
        $div.classList.add('sticky');
        $div.id = `${id}`;
        $div.style.cssText = `top: ${top}px;
                                left: ${left}px;
                                z-index: ${zIndex};`;
        $div.innerHTML = makeSticky(id, text, date);
        this.$wrapper.appendChild($div);
        this.addEvent($div, sticky);
    };

    createSticky(sticky: Sticky) {
        this.makeStickyHTML(sticky);
    }

    _render() {
        console.log('render tasks');
        this.$wrapper.innerHTML = '';
        const stickies: Sticky[] = this.app.getStickies();
        stickies.forEach(sticky => {
            this.createSticky(sticky);
        });
        localStorage[STICKY_LS] = JSON.stringify(this.app);
    }
}
new DOMRenderer(document, new App());
