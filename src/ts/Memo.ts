class Memo {
    constructor(
        public id = 0,
        public top = 0,
        public left = 0,
        public zIndex = 0,
        public text = ''
    ) {
        this.id = id;
        this.top = top;
        this.left = left;
        this.zIndex = zIndex;
        this.text = text;
    }

    static get(id = 0) {
        return new Memo(id);
    }

    static load({ id, top, left, zIndex, text }: Memo) {
        return new Memo(id, top, left, zIndex, text);
    }

    setText(value: string) {
        this.text = value;
    }

    setPosition({ x = 0, y = 0 }) {
        this.top = y;
        this.left = x;
    }

    setZIndex(z = 0) {
        this.zIndex = z;
    }

    getInfo() {
        const { id, top, left, zIndex, text } = this;
        return { id, top, left, zIndex, text };
    }
}

export default Memo;
