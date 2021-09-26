/**
 * @description 겹치는 여부 판단
 * @param target 움직이는 애
 * @param original
 * @return boolean
 * */
import Sticky from '../ts/models/Sticky';
import { STICKY_HEIGHT, STICKY_WIDTH } from './constant';

function checkInside(target: Sticky, original: Pick<Sticky, 'top' | 'left'>) {
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
}

export default checkInside;
