// eslint-disable-next-line max-classes-per-file
import { STICKY_HEIGHT, STICKY_LS, STICKY_WIDTH } from '~/util/constant';

const stickyWrapElement = document.getElementById('sticky_wrap')!;

/**
 * @@brief 최소한 메모 가능한 기능 클래스.
 * @@brief id 내용 기록, 시작 좌표, 메모 내용이 담겨있다.
 */
class Memo {
    constructor(
        public id = '0',
        public top?: string,
        public left?: string,
        public text = ''
    ) {
        this.id = id;
        this.top = top;
        this.left = left;
        this.text = text;
    }
}

/**
 * @@brief 메모 + 스티키 기능 클래스.
 * @@brief 기존 메모에 zIndex를 추가해 스티키 간에 겹치는 기능과 생성 날짜 정보가 담겨있다.
 */
class Sticky extends Memo {
    public stickyElement?: HTMLElement;

    public textAreaElement?: HTMLTextAreaElement;

    public date: string;

    constructor(
        public id = '0',
        public top = '100',
        public left = '100',
        public text = '',
        public zIndex = '0',
        date = ''
    ) {
        // 클래스 속성 설정.
        super(`${id}`, top, left, text);
        this.zIndex = zIndex;
        this.date = date;

        // 스티키 생성 및 부모 DOM에 삽입
        this.CreateStickyElement(id);

        // id 등록 및 클래스에 stikcy div 등록.
        this.SetId();

        // sticky 위치 및 z-index 설정.
        this.SetXY(left, top);
        this.SetZIndex(zIndex);

        // sticky 메모 초기화 및 값 설정.
        this.InitMemo();
        this.SetMemo(text);

        // 이벤트 등록
        this.AddStickyEvent();
    }

    /**
     * 스티키 관련 이벤트를 등록한다.
     */
    AddStickyEvent() {
        // 드래그 이벤트 등록
        const stickyElement = stickyWrapElement.lastChild as HTMLElement;
        const topNavElment = stickyElement.querySelector('.top_nav')!;
        topNavElment.addEventListener('mousedown', startDragWithSticky);

        // 세이브
        const saveElent = stickyElement.querySelector('.save')!;
        saveElent.addEventListener('mousedown', this.saveSticky);

        // 삭제
        const deleteElement = stickyElement.querySelector('.del')!;
        deleteElement.addEventListener('mousedown', this.delSticky);

        // 새로 생성
        const addElement = stickyElement.querySelector('.add')!;
        addElement.addEventListener('mousedown', this.addSticky);

        // 새로 생성
        const getElment = stickyElement.querySelector('.get')!;
        getElment.addEventListener('mousedown', this.displaySticky);
    }

    /**
     * @param  id 스티키 id를 설정한다.
     */
    SetId() {
        this.stickyElement = document.getElementById(`${this.id}`)!;
    }

    /**
     *
     * @param  zIndex zIndex를 설정한다.
     */
    SetZIndex(zIndex: string) {
        this.zIndex = zIndex;
        this.stickyElement!.style.zIndex = zIndex;
    }

    /**
     * @param  left x좌표
     * @param top y좌표
     */
    SetXY(left: string, top: string) {
        this.left = left;
        this.top = top;
        this.stickyElement!.style.left = `${left}px`;
        this.stickyElement!.style.top = `${top}px`;
    }

    InitMemo() {
        this.textAreaElement = this.stickyElement!.querySelector('textarea')!;
    }

    /**
     * @param text 바꿀 스티키 내용
     * @brief 스티키 내용을 출력한다.
     */
    SetMemo(text: string) {
        this.text = text;
        this.textAreaElement!.innerHTML = text;
    }

    /**
     * @brief 스티키 날짜를 설정한다.
     */
    SetDate() {
        this.date = new Date().toLocaleDateString();
    }

    /**
     * @@brief 스티키 관련 DOM 엘레먼트를 생성한다.
     * @param id 부여 할 스티키 id
     */
    CreateStickyElement(id: string) {
        const html = `<div class="sticky" id="${id}">
                <nav class="side_nav">
                    <ol></ol>
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
                <textarea name="txt" class="txt"></textarea>
            </div>`;
        stickyWrapElement.insertAdjacentHTML('beforeend', html);
    }

    /**
     * @brief 모든 스티키 정보를 로컬 스토리지에 저장한다.
     */
    saveSticky = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const tmp = this.parentNode.parentNode;
        const tmp2 = GetStickyObjWithStickyDiv(tmp);
        tmp2.SetMemo(tmp2.textAreaElement!.value);

        localStorage.setItem(STICKY_LS, JSON.stringify(stickyList));
    };

    /**
     * @brief 해당 스티키를 삭제한다.
     */
    delSticky = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const stickyElement = this.parentNode.parentNode.parentNode;
        const stickyObj = GetStickyObjWithStickyDiv(stickyElement);

        stickyWrapElement.removeChild(stickyElement);

        const delId = stickyObj.id;

        const newStickyList = stickyList.filter(function (obj) {
            return delId !== obj.id;
        });

        stickyList = newStickyList;

        if (stickyList.length != 0) {
            localStorage.setItem(STICKY_LS, JSON.stringify(stickyList));
        }
    };

    /**
     * 새 스티키를 추가한다.
     */
    addSticky = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const newId = getId();

        const top = Math.floor(
            Math.random() * (stickyWrapElement.clientHeight - STICKY_HEIGHT)
        );
        const left = Math.floor(
            Math.random() * (stickyWrapElement.clientWidth - STICKY_WIDTH)
        );

        const newSticky = new Sticky(newId, String(top), String(left));
        newSticky.SetDate();
        attachSticky(newSticky);

        localStorage.setItem(STICKY_LS, JSON.stringify(stickyList));
    };

    /**
     * @brief 해당 스티키의 정보를 출력한다.
     */
    displaySticky = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const sideNavElement =
            event.parentNode.parentNode.parentNode.querySelector('.side_nav')!;
        sideNavElement.classList.toggle('active');

        const stickyElement = sideNavElement.parentNode;
        const stickyObj = GetStickyObjWithStickyDiv(stickyElement);

        const olElement = sideNavElement.querySelector('ol')!;
        olElement.innerHTML = '';
        olElement.innerHTML += `<li>ID: ${stickyObj.id}</li>`;
        olElement.innerHTML += `<li>Date: ${stickyObj.date}</li>`;
    };
}

/**
 * @return original과 target이 겹쳐지면 true를 반환, 아닌 경우 false를 반환한다.
 * @@brief 스티키가 겹쳐지는 여부를 체크한다.
 * @param original 겹치는 대상 체크의 원본
 * @param target 겹치는 대상과 비교할 대상
 */

/**
 * @description 겹치는 여부 판단
 * @param target 움직이는 애
 * @param original
 * @return boolean
 * */
const checkInside = (
    target: Sticky,
    original: Pick<Sticky, 'top' | 'left'>
) => {
    const { left: tLeft, top: tTop } = target;
    const { left: oLeft, top: oTop } = original;

    // 오른쪽
    if (tLeft >= oLeft && tLeft <= oLeft + STICKY_WIDTH) {
        // 하단
        if (oTop <= tTop && tTop <= oTop + STICKY_HEIGHT) {
            return true;
        }

        // 상단
        if (oTop >= tTop && oTop <= tTop + STICKY_HEIGHT) {
            return true;
        }
    }

    // 왼쪽
    if (tLeft <= oLeft && tLeft + STICKY_WIDTH >= oLeft) {
        // 하단
        if (oTop <= tTop && tTop <= oTop + STICKY_HEIGHT) {
            return true;
        }

        // 상단
        if (oTop >= tTop && oTop <= tTop + STICKY_HEIGHT) {
            return true;
        }
    }

    return false;
};

/**
 * @@brief 스티키를 배치한다.
 * @param sticky 스티키 배치 정보가 담긴 오브젝트.
 */
function PutStickyWithZIndex(sticky: Sticky) {
    let maxZindex = -1;

    stickyList.forEach(({ id, top, left, zIndex }) => {
        if (id === sticky.id) return;

        if (checkInside(sticky, { top, left })) {
            if (maxZindex < +zIndex) {
                maxZindex = +zIndex;
            }
        }
    });

    sticky.SetZIndex(String(maxZindex + 1));
}

/**
 * @@brief 스티키 삭제 버튼이 눌려졌을 경우
 */
function RemoveStickyWithZIndex(sticky: Sticky) {
    const currentDragStickyZindex = sticky.zIndex;

    // 제거 된 경우 겹쳐진 나머지 스티키 중 제거 스티키 보다 위에 있는 스티키의 경우 z-index가 -1씩 되어야 한다.
    for (let idx = 0; idx < stickyList.length; idx += 1) {
        const currentSticky = stickyList[idx];

        if (sticky.id === currentSticky.id) {
            // eslint-disable-next-line no-continue
            continue;
        }

        if (checkInside(sticky, currentSticky)) {
            const currentZindex = currentSticky.zIndex;
            if (currentDragStickyZindex < currentZindex) {
                const newZindex = +currentZindex - 1;
                currentSticky.SetZIndex(String(newZindex));
            }
        }
    }
}

/**
 * @return 스티키 리스트 중 빈 곳 중 가장 낮은 id를 반환한다.
 * @@brief 새로운 id를 부여한다. 스티키 리스트 중 빈 곳 중 가장 낮은 id를 반환한다.
 */
function getId() {
    // 오름차순 정렬
    const stickyArr = [...stickyList];
    stickyArr.sort(({ id: a }, { id: b }) => +a - +b);

    let curId = 0;

    // id 찾기
    for (let idx = 0; idx < stickyArr.length; idx += 1) {
        const compareId = parseInt(stickyArr[idx].id, 10);
        if (curId >= compareId) {
            curId = compareId + 1;
        } else {
            break;
        }
    }

    return String(curId);
}

/**
 * @param sticky 생성 할 스티키 정보가 담긴 참조 객체
 */
function attachSticky(sticky: Sticky) {
    stickyList.push(sticky);

    // 스티키를 배치한다.
    PutStickyWithZIndex(sticky);
}

/**
 * @brief 로컬 스토리지에 저장된 모든 스티키를 불러온다.
 */
function LoadStickys() {
    const localSticky: Sticky[] = JSON.parse(
        <string>localStorage.getItem(STICKY_LS)
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
}

let stickyList: Sticky[] = [];

// 스티키 드래그 시 보정 값 x, y
let stickyLeft = 0;
let stickyTop = 0;

// 현재 드래그 중인 스티키의 div.
let dragSticky: HTMLElement | null;

/**
 * @@brief 해당 id의 StickyObject를 반환한다.
 * @param {*} id
 */
function GetStickyObjWithId(id: string): Sticky {
    for (let idx = 0; idx < stickyList.length; idx += 1) {
        const currentSticky = stickyList[idx];
        if (id === currentSticky.id) {
            return currentSticky;
        }
    }
}

/**
 * @@brief 해당 sticky_div와 매칭되는 StickyObject를 반환한다.
 * @param {*} stickyDivElement
 */
function GetStickyObjWithStickyDiv(stickyDivElement: HTMLElement): Sticky {
    return GetStickyObjWithId(stickyDivElement.id);
}

/**
 * @@brief 스티키 드래그 이벤트. 스티키 위치를 마우스 드래그에 따라 이동하게 만든다.
 * @param {*} event 이벤트 오브젝트
 */
function MoveDragWithSticky({ clientX, clientY }: MouseEvent): boolean {
    if (!dragSticky) return false;
    const currentLeft = parseInt(String(clientX + stickyLeft), 10);
    const currentTop = parseInt(String(clientY + stickyTop), 10);
    dragSticky.style.left = `${currentLeft}px`;
    dragSticky.style.top = `${currentTop}px`;

    return false;
}

/**
 * @@brief 스티키 드래그 이벤트가 끝날 때 호출된다. 드래그한 스티키의 z-index를 겹치는 스티키에 따라 재 부여한다.
 */
function StopDragWithSticky() {
    if (!dragSticky) return;
    dragSticky.style.zIndex = '0';

    document.onmousemove = null;
    document.onmouseup = null;

    const currentSticky = GetStickyObjWithStickyDiv(dragSticky)!;
    currentSticky.SetXY(
        parseInt(dragSticky.style.left, 10),
        parseInt(dragSticky.style.top, 10)
    );

    PutStickyWithZIndex(currentSticky);
}

/**
 * @@brief 스티키 드래그 이벤트가 시작 할 때 호출한다.
 * @param {*} event 이벤트 오브젝트
 */
function startDragWithSticky(event) {
    dragSticky = event.target.parentNode;
    if (!dragSticky) return;
    stickyLeft = parseInt(String(dragSticky.offsetLeft), 10) - event.clientX;
    stickyTop = parseInt(String(dragSticky.offsetTop), 10) - event.clientY;

    document.onmousemove = MoveDragWithSticky;
    document.onmouseup = StopDragWithSticky;

    // ZIndex조정
    const currentStickyObj = GetStickyObjWithStickyDiv(dragSticky);

    dragSticky.style.zIndex = '999';
    RemoveStickyWithZIndex(currentStickyObj);

    event.preventDefault();
}

function init() {
    LoadStickys();
}

// 초기화
init();
