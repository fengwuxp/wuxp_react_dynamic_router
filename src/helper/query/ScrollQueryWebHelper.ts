import * as React from "react";
import {SyntheticEvent} from "react";

/**
 * 滚动查询
 */
export default class ScrollQueryWebHelper {

    private lastScrollTop: number = -1;


    /**
     * 触发nextPage的临界值
     * @type {number}
     */
    private onEndReachedThreshold: number = 150;


    /**
     * 是否可以加载下一信息
     * @param {React.SyntheticEvent<HTMLElement>} event
     * @return {boolean}
     */
    isNextPage = (event: React.SyntheticEvent<HTMLElement>): boolean => {

        let target: HTMLElement = event.nativeEvent.target as HTMLElement;
        let scrollTop = target.scrollTop;

        let number = this.lastScrollTop - scrollTop;

        this.lastScrollTop = scrollTop;

        if (number > 0) {
            //向下拉动，不处理
            return false;
        }

        //是否执行查询的判断
        let scrollHeight = target.scrollHeight - target.offsetHeight;


        if (scrollTop < (scrollHeight - this.onEndReachedThreshold)) {

            return false;
        }
        console.log("执行查询", scrollHeight);

        //距离页面底部 onEndReachedThreshold 是表示可以进行下一页的查询

        return true;
    }
}
