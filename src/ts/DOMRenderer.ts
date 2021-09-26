import App from './App';
import Renderer from './Renderer';
import Sticky from './models/Sticky';
import { makeSticky } from '../util/makeTemplate';
import checkInside from '../util/checkInsede';

const STICKY_LS = 'sticky_storage';

class DOMRenderer extends Renderer {
    public $wrapper: HTMLElement;

    public stickyTop: number = 0;

    public stickyLeft: number = 0;

    public dragSticky?: HTMLElement;

    public currentSticky?: Sticky;

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

    putStickyWithZIndex = (sticky: Sticky) => {
        let maxZIndex = -1;

        this.app.getStickies().forEach(({ id, top, left, zIndex }) => {
            if (id === sticky.getInfo().id) return;
            if (checkInside(sticky, { top, left })) {
                if (maxZIndex < zIndex) {
                    maxZIndex = zIndex;
                }
            }
        });

        sticky.setZIndex(maxZIndex + 1);
    };

    dragChangeZIndex = (sticky: Sticky) => {
        const { id: targetId, zIndex: targetZIndex } = sticky.getInfo();

        this.app.getStickies().forEach(stk => {
            const { id, zIndex } = stk.getInfo();
            if (id === targetId) return;

            if (checkInside(sticky, stk) && targetZIndex < zIndex) {
                stk.setZIndex(zIndex - 1);
            }
        });
    };

    handleAddBtn = (event: Event) => {
        event.stopPropagation();
        const newSticky = Sticky.get(this.app.getNewId());
        this.putStickyWithZIndex(newSticky);
        this.app.addStickies(newSticky);
        this.render();
    };

    handleSaveBtn = (event: Event, sticky: Sticky) => {
        event.stopPropagation();
        const target = this.parent.getElementById(
            `${sticky.getInfo().id}`
        ) as HTMLElement;
        const { top, left, zIndex } = target.style;
        const { value: text } = target.querySelector('textarea')!;
        sticky
            .setPosition(Number.parseInt(top, 10), Number.parseInt(left, 10))
            .setText(text)
            .setZIndex(Number.parseInt(zIndex, 10))
            .setDate();

        this.render();
    };

    handleGetBtn = (event: Event) => {
        event.stopPropagation();
        const target = event.currentTarget as HTMLElement;
        target
            .closest('.sticky')!
            .querySelector('.side_nav')!
            .classList.toggle('active');
    };

    handleDelBtn = (event: Event, sticky: Sticky) => {
        event.stopPropagation();
        this.app.removeSticky(sticky);
        this.render();
    };

    startDrag = (event: Event, sticky: Sticky) => {
        console.log('star Drag');
        const $target = event.currentTarget as HTMLElement;
        this.dragSticky = $target.parentNode as HTMLDivElement;
        if (!this.dragSticky) return;

        this.currentSticky = sticky;
        const { clientX, clientY } = event as MouseEvent;

        this.stickyLeft = this.dragSticky.offsetLeft - clientX;
        this.stickyTop = this.dragSticky.offsetTop - clientY;

        document.onmousemove = this.moveDrag;
        document.onmouseup = this.stopDrag;
        this.dragSticky.style.zIndex = '999';
        this.dragChangeZIndex(sticky);
    };

    moveDrag = ({ clientX, clientY }: MouseEvent) => {
        if (!this.dragSticky) return;
        this.dragSticky.style.cssText = `top: ${clientY + this.stickyTop}px;
                                         left: ${clientX + this.stickyLeft}px;`;
    };

    stopDrag = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        if (!this.dragSticky || !this.currentSticky) return;
        this.dragSticky.style.zIndex = '0';

        document.onmousemove = null;
        document.onmouseup = null;
        const { top, left } = this.dragSticky.style;
        this.currentSticky.setPosition(
            Number.parseInt(top, 10),
            Number.parseInt(left, 10)
        );

        this.putStickyWithZIndex(this.currentSticky);
        this.render();
    };

    addEvent = (el: HTMLElement, sticky: Sticky) => {
        const addBtn = el.querySelector('.add')!;
        const saveBtn = el.querySelector('.save')!;
        const getBtn = el.querySelector('.get')!;
        const delBtn = el.querySelector('.del')!;
        const topNav = el.querySelector('.top_nav')!;

        addBtn.addEventListener('mousedown', this.handleAddBtn);
        saveBtn.addEventListener('mousedown', e =>
            this.handleSaveBtn(e, sticky)
        );
        getBtn.addEventListener('mousedown', this.handleGetBtn);
        delBtn.addEventListener('mousedown', e => this.handleDelBtn(e, sticky));
        topNav.addEventListener('mousedown', e => this.startDrag(e, sticky));
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
export default DOMRenderer;
