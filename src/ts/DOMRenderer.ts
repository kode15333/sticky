import App from './models/App';
import Renderer from './Renderer';
import Sticky from './models/Sticky';
import { makeSticky } from '../util/makeTemplate';
import checkInside from '../util/checkInsede';
import { FOLDER_LS } from '../util/constant';
import Folder from './models/Folder';

class DOMRenderer extends Renderer {
    public $wrapper: HTMLElement;

    public stickyTop: number = 0;

    public stickyLeft: number = 0;

    public dragSticky?: HTMLElement;

    public currentSticky?: Sticky;

    private currenFolder: number = 0;

    private folder: Folder;

    constructor(private parent: Document, public app: App) {
        super(app);
        if (!localStorage[FOLDER_LS]) {
            this.app.addFolder(Folder.get());
            localStorage[FOLDER_LS] = JSON.stringify(this.app);
        } else {
            this.app = App.load(JSON.parse(localStorage[FOLDER_LS]));
            this.currenFolder = 0;
        }
        this.parent = parent;
        this.folder = this.app.getFolder(this.currenFolder);
        this.$wrapper = parent.querySelector('#stickyContainer')!;
        this.render();
        this.addMenuEvent();
    }

    setCurrentFolder = () => {
        this.folder = this.app.getFolder(this.currenFolder);
        this.render();
    };

    private addMenuEvent = () => {
        const $menu = this.parent.querySelector('.sidebar-toggle')!;
        const $app = this.parent.querySelector('#app')!;
        const $add = this.parent.querySelector('.folder-control .add')!;

        $menu.addEventListener('click', () => {
            $app.classList.toggle('active');
        });

        $add.addEventListener('click', () => {
            let newFolderName = window.prompt(
                'input folder label',
                'new Folder'
            );

            if (!newFolderName || newFolderName.trim().length === 0) {
                newFolderName = 'new Folder';
            }

            const id = this.app.getFolders().length;
            this.app.addFolder(Folder.get(id, newFolderName));
            this.currenFolder = id;
            this.setCurrentFolder();
        });
    };

    private putStickyWithZIndex = (sticky: Sticky) => {
        let maxZIndex = -1;

        this.folder.getStickies().forEach(({ id, top, left, zIndex }) => {
            if (id === sticky.getInfo().id) return;
            if (checkInside(sticky, { top, left })) {
                if (maxZIndex < zIndex) {
                    maxZIndex = zIndex;
                }
            }
        });

        sticky.setZIndex(maxZIndex + 1);
    };

    private dragChangeZIndex = (sticky: Sticky) => {
        const { id: targetId, zIndex: targetZIndex } = sticky.getInfo();

        this.folder.getStickies().forEach(stk => {
            const { id, zIndex } = stk.getInfo();
            if (id === targetId) return;

            if (checkInside(sticky, stk) && targetZIndex < zIndex) {
                stk.setZIndex(zIndex - 1);
            }
        });
    };

    private handleAddBtn = (event: Event) => {
        event.stopPropagation();
        const newSticky = Sticky.get(this.folder.getNewId());
        this.putStickyWithZIndex(newSticky);
        this.folder.addSticky(newSticky);
        this.render();
    };

    private handleSaveBtn = (event: Event, sticky: Sticky) => {
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

    private handleGetBtn = (event: Event) => {
        event.stopPropagation();
        const target = event.currentTarget as HTMLElement;
        target
            .closest('.sticky')!
            .querySelector('.side_nav')!
            .classList.toggle('active');
    };

    private handleDelBtn = (event: Event, sticky: Sticky) => {
        event.stopPropagation();
        this.folder.removeSticky(sticky);
        this.render();
    };

    private startDrag = (event: Event, sticky: Sticky) => {
        const $target = event.currentTarget as HTMLElement;
        this.dragSticky = $target.parentNode as HTMLDivElement;
        if (!this.dragSticky) return;

        this.currentSticky = sticky;
        const { clientX, clientY } = event as MouseEvent;

        this.stickyLeft = this.dragSticky.offsetLeft - clientX;
        this.stickyTop = this.dragSticky.offsetTop - clientY;

        this.$wrapper.onmousemove = this.moveDrag;
        this.$wrapper.onmouseup = this.stopDrag;
        this.dragSticky.style.zIndex = '900';
        this.dragChangeZIndex(sticky);
    };

    private moveDrag = ({ clientX, clientY }: MouseEvent) => {
        if (!this.dragSticky) return;
        this.dragSticky.style.top = `${clientY + this.stickyTop}px`;
        this.dragSticky.style.left = `${clientX + this.stickyLeft}px`;
    };

    private stopDrag = (event: MouseEvent) => {
        event.stopPropagation();
        if (!this.dragSticky || !this.currentSticky) return;

        this.$wrapper.onmousemove = null;
        this.$wrapper.onmouseup = null;

        const { top, left } = this.dragSticky.style;
        this.currentSticky.setPosition(
            Number.parseInt(top, 10),
            Number.parseInt(left, 10)
        );

        this.putStickyWithZIndex(this.currentSticky);
        this.render();
    };

    private addEvent = (el: HTMLElement, sticky: Sticky) => {
        // const localSave = document.querySelector('.localSave')!;

        const addBtn = el.querySelector('.add')!;
        const saveBtn = el.querySelector('.save')!;
        const getBtn = el.querySelector('.get')!;
        const delBtn = el.querySelector('.del')!;
        const topNav = el.querySelector('.top_nav')!;

        // localSave.addEventListener('mousedown', () => {
        //     localStorage[FOLDER_LS] = JSON.stringify(this.app);
        // });
        addBtn.addEventListener('mousedown', this.handleAddBtn);
        saveBtn.addEventListener('mousedown', e =>
            this.handleSaveBtn(e, sticky)
        );
        getBtn.addEventListener('mousedown', this.handleGetBtn);
        delBtn.addEventListener('mousedown', e => this.handleDelBtn(e, sticky));
        topNav.addEventListener('mousedown', e => this.startDrag(e, sticky));
    };

    private makeStickyHTML = (sticky: Sticky) => {
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

    private createSticky(sticky: Sticky) {
        this.makeStickyHTML(sticky);
    }

    _render() {
        console.log('render tasks');
        this.$wrapper.innerHTML = '';
        const stickies: Sticky[] = this.folder.getStickies();
        console.log(stickies);
        stickies.forEach(sticky => {
            this.createSticky(sticky);
        });
        localStorage[FOLDER_LS] = JSON.stringify(this.app);
    }
}
export default DOMRenderer;
