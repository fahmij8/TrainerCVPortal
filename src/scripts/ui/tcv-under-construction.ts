import underConstruction from "../../templates/under-construction.html";
import { tcv_Display } from "../utilities/display/components";

export const displayUnderConstruction = (toRemove: string): void => {
    tcv_Display.displayContent(() => {
        $(".tcv-content").append(underConstruction).addClass("invisible");
    }, toRemove);
};
