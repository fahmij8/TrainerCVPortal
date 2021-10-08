import references from "../../templates/references.html";
import { tcv_Display } from "../utilities/display/components";

export const displayReferences = (toRemove: string): void => {
    tcv_Display.displayContent(() => {
        $(".tcv-content").append(references).addClass("invisible");
    }, toRemove);
};
