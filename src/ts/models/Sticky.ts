import Memo from './Memo';
import { STICKY_HEIGHT, STICKY_WIDTH } from '../../util/constant';

class Sticky extends Memo {
    public zIndex;

    public date;

    constructor({
        id = 0,
        top = 0,
        left = 0,
        text = '',
        zIndex = 0,
        date = new Date().toLocaleDateString(),
    }) {
        super(id, top, left, text);
        this.zIndex = zIndex;
        this.date = date;
    }

    static get(id = 0) {
        const top = Math.floor(Math.random() * STICKY_HEIGHT);
        const left = Math.floor(Math.random() * STICKY_WIDTH);
        return new Sticky({ id, top, left });
    }

    static load({ id, top, left, text, zIndex, date }: Sticky) {
        return new Sticky({ id, top, left, text, zIndex, date });
    }

    toJSON() {
        return this.getInfo();
    }

    setZIndex(z = 999) {
        this.zIndex = z;
        return this;
    }

    setDate(date = new Date().toLocaleDateString()) {
        this.date = date;
    }

    getInfo() {
        return this;
    }
}

export default Sticky;
