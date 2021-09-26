export const makeSticky = (
    id = 0,
    text = '',
    date = new Date().toLocaleDateString()
) => {
    return `<nav class="side_nav">
                    <ol>
                        <li>ID : ${id}</li>
                        <li>DATE : ${date}</li>
                    </ol>
                </nav>
                <nav class="top_nav">
                    <a class="add">
                        <i class="fa fa-plus"></i>
                    </a>
                    <a class="save">
                        <i class="fa fa-floppy-o"></i>
                    </a>
                    <div class="right">
                        <a class="get">
                            <i class="fa fa-list"></i>
                        </a>
                        <a class="del">
                            <i class="fa fa-times"></i>
                        </a>
                    </div>
                </nav>
                <textarea name="txt" class="txt">${text}</textarea>`;
};
