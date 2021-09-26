import Memo from './Memo';

class Sticky extends Memo {
    constructor(
        public id = 0,
        public top = 0,
        public left = 0,
        public text = '',
        public zIndex = 0,
        public date = new Date().toLocaleDateString()
    ) {
        super(id, top, left, text);
        this.zIndex = zIndex;
        this.date = date;
    }

    static get(id = 0) {
        return new Sticky(id);
    }

    static load({ id, top, left, text, zIndex, date }: Sticky) {
        return new Sticky(id, top, left, text, zIndex, date);
    }

    setZIndex(z = 999) {
        this.zIndex = z;
        return this;
    }

    setDate(date = new Date().toLocaleDateString()) {
        this.date = date;
    }
}

export default Sticky;
