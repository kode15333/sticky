import { STICKY_LS } from '~/util/constant';

class Memo {
    constructor(
        private id = '0',
        private top = 0,
        private left = 0,
        private text = ''
    ) {
        this.id = id;
        this.top = top;
        this.left = left;
        this.text = text;
    }
}

class Sticky extends Memo {}
class Renderer {
    constructor(public app: any) {
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
    constructor(private id: string, private app: any) {
        super(app);
    }

    loadStickys = () => {
        const localSticky: Sticky[] = JSON.parse(
            localStorage.getItem(STICKY_LS) || ''
        );

        if (localSticky === null || !localSticky.length) {
            // 하나도 없는 경우 기본 메모장 생성
            const newSticky = new Sticky();
            newSticky.SetDate();
            attachSticky(newSticky);

            return;
        }

        localSticky.forEach(sticky => {
            const { id, left, top, text, zIndex, date } = sticky;
            const curSticky = new Sticky(id, left, top, text, zIndex, date);
            attachSticky(curSticky);
        });
    };

    init() {}
}

new DOMRenderer('app', new App());
