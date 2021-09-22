class Memo {
    constructor(
        private id = 0,
        private top = 0,
        private left = 0,
        private text = ''
    ) {
        this.id = id;
        this.top = top;
        this.left = left;
        this.text = text;
    }

    static get(id = 0) {
        return new Memo(id);
    }

    static load({ id, top, left, text }: Memo) {
        return new Memo(id, top, left, text);
    }

    setText(value: string) {
        this.text = value;
    }

    setPosition({ x = 0, y = 0 }) {
        this.top = y;
        this.left = x;
    }

    getInfo() {
        const { id, top, left, text } = this;
        return { id, top, left, text };
    }
}

export default Memo;
