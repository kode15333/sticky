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

    _render() {
        console.log('render tasks');
        const stickies: Sticky[] = this.app.getStickies();
        stickies.forEach(sticky => {
            this.createSticky(sticky);
        });
    }

    handleAddBtn = (id: number) => {
        console.log('add', id);
    };

    handleSaveBtn = (id: number) => {
        console.log('save', id);
        console.log(this.app.getStickyInfo(id));
    };

    handleGetBtn = (id: number) => {
        console.log('get', id);
    };

    handleDelBtn = (id: number) => {
        console.log('del', id);
    };

    handleTextArea = (str: string, id: number) => {
        console.log('st', str, id);
    };

    addEvent = (el: HTMLElement, id: number) => {
        const addBtn = el.querySelector('.add')!;
        const saveBtn = el.querySelector('.save')!;
        const getBtn = el.querySelector('.get')!;
        const delBtn = el.querySelector('.del')!;
        // const textArea = el.querySelector('textarea')!;

        addBtn.addEventListener('click', () => this.handleAddBtn(id));
        saveBtn.addEventListener('click', () => this.handleSaveBtn(id));
        getBtn.addEventListener('click', () => this.handleGetBtn(id));
        delBtn.addEventListener('click', () => this.handleDelBtn(id));
        // textArea.addEventListener('input', event => {
        //     const { value } = event.target as HTMLTextAreaElement;
        //     this.handleTextArea(value, id);
        // });
    };

    makeStickyHTML = ({ id, top, left, text, zIndex }: Sticky) => {
        const divEle = document.createElement('div');
        divEle.classList.add('sticky');
        divEle.id = `${id}`;
        divEle.style.cssText = `top: ${top}px;
                                left: ${left}px;
                                z-index: ${zIndex};`;
        divEle.innerHTML = makeSticky(text);
        this.$wrapper.appendChild(divEle);
        this.addEvent(divEle, id);
    };

    createSticky(sticky: Sticky) {
        const { makeStickyHTML } = this;
        makeStickyHTML(sticky);
    }
}
new DOMRenderer(document, new App());
