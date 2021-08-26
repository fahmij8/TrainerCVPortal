export const routePage = (): void => {
    let page: string = window.location.hash.substr(1);
    if (page === "") page = "dashboard";
};
