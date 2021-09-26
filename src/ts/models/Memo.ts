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
        return this;
    }

    setPosition(top = 0, left = 0) {
        this.top = top;
        this.left = left;
        return this;
    }

    getInfo() {
        const { id, top, left, text } = this;
        return { id, top, left, text };
    }
}

export default Memo;
