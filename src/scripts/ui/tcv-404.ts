import notFound from "../../templates/404.html";
import { tcv_Display } from "../utilities/display/components";

export const displayNotFound = (toRemove: string): void => {
    tcv_Display.displayContent(() => {
        $(".tcv-content").append(notFound).addClass("invisible");
        $(() => {
            console.log(document.readyState);
        });
    }, toRemove);
};
