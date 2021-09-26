import Memo from './Memo';

class Sticky extends Memo {
    constructor(
        public id = 0,
        public top = 0,
        public left = 0,
        public text = '',
        public zIndex = 0
    ) {
        super(id, top, left, text);
        this.zIndex = zIndex;
    }

    static get(id = 0) {
        return new Sticky(id);
    }

    static load({ id, top, left, text, zIndex }: Sticky) {
        return new Sticky(id, top, left, text, zIndex);
    }

    setZIndex(z = 999) {
        this.zIndex = z;
        return this;
    }
}

export default Sticky;
