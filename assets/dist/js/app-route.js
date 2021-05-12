import { sbUtil, sbReInit, greetings } from "./app-display-utilities.js";
import { getUserInfo, logOut } from "./app-login.js";
import { addUserData } from "./app-rtdb.js";

const loadPage = (page) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            let content = document.querySelector("#content");
            if (xhttp.status === 200) {
                firebase.auth().onAuthStateChanged(async (user) => {
                    if (!user && page !== "login") {
                        // Tell user to login
                        window.location.href = "./#login";
                        routePage();
                    } else if (!user && page === "login") {
                        // Display Login page
                        content.innerHTML = xhttp.responseText;
                        $("#content").removeAttr("class").addClass("hold-transition login-page");
                        $("#login").click(() => {
                            let provider = new firebase.auth.GoogleAuthProvider();
                            firebase.auth().signInWithRedirect(provider);
                        });
                    } else if (user && page === "login") {
                        // Redirect to dashboard
                        window.location.href = "./#dashboard";
                        routePage();
                    } else {
                        addUserData();
                        // Display corresponding page
                        let contentPage = xhttp.responseText;
                        await loadShell(contentPage, "#fillContent");
                    }
                });
            } else {
                // Display not found page
                xhttp.open("GET", `./assets/pages/404.html`, true);
                xhttp.send();
                content.innerHTML = xhttp.responseText;
            }
        }
    };
    xhttp.open("GET", `./assets/pages/${page}.html`, true);
    xhttp.send();
};

const loadShell = async (contentToAppend, elements) => {
    let page = window.location.hash.substr(1);
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
            let content = document.querySelector("#content");
            if (xhttp.status === 200) {
                if ($("#sidenavAccordion").length === 0) {
                    // If shell is not loaded yet
                    content.innerHTML = xhttp.responseText;
                    sbUtil();
                    getUserInfo().then((data) => {
                        $(".dropdown-user-details-name").html(data.displayName);
                        $(".dropdown-user-details-email").html(data.email);
                        $(".user-photo").attr("src", data.photoURL);
                        $(".dropdown-user-img").attr("src", data.photoURL);
                        $(".user-logout").click(() => {
                            logOut();
                        });
                    });
                }
                $(".nav-link").click((links) => {
                    let destination = links.target.hash;
                    if (destination === "") {
                        null;
                    } else {
                        window.location.href = `./${destination}`;
                        routePage();
                    }
                });
                $(".nav-tag").click((links) => {
                    let destination = links.currentTarget.dataset.href;
                    if (destination === "") {
                        window.location.href = `./${destination}`;
                        routePage();
                    }
                });
                document.querySelector(elements).innerHTML = contentToAppend;
                sbReInit();
                let greet = greetings();
                if (page === "dashboard") {
                    getUserInfo().then((data) => {
                        $(".page-header-subtitle").html(`${greet}, ${data.displayName}!`);
                    });
                } else if (page === "grading") {
                    getUserInfo().then((data) => {
                        $(".user-name").html(`${data.displayName}`);
                    });
                } else if (page === "remote-access") {
                }
            } else {
                xhttp.open("GET", `./assets/pages/404.html`, true);
                xhttp.send();
                content.innerHTML = xhttp.responseText;
            }
        }
    };
    xhttp.open("GET", `./assets/pages/navshell.html`, true);
    xhttp.send();
};

const routePage = () => {
    let page = window.location.hash.substr(1);
    if (page == "") page = "login";
    setTimeout(() => loadPage(page), 300);
};

export { routePage };
