class Memo {
    constructor(
        public id: number,
        public top: number,
        public left: number,
        public text: string
    ) {
        this.id = id;
        this.top = top;
        this.left = left;
        this.text = text;
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
