let sbUtil = () => {
    $("body").removeAttr("class").addClass("nav-fixed");
    /*!
     * Start Bootstrap - SB Admin Pro v1.3.0 (https://shop.startbootstrap.com/product/sb-admin-pro)
     * Copyright 2013-2020 Start Bootstrap
     * Licensed under SEE_LICENSE (https://github.com/StartBootstrap/sb-admin-pro/blob/master/LICENSE)
     */
    (function ($) {
        "use strict";

        // Enable Bootstrap tooltips via data-attributes globally
        $('[data-toggle="tooltip"]').tooltip();

        // Enable Bootstrap popovers via data-attributes globally
        $('[data-toggle="popover"]').popover();

        $(".popover-dismiss").popover({
            trigger: "focus",
        });

        // Add active state to sidbar nav links
        var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
        $("#layoutSidenav_nav .sidenav a.nav-link").each(function () {
            if (this.href === path) {
                $(this).addClass("active");
            }
        });

        // Toggle the side navigation
        $("#sidebarToggle").on("click", function (e) {
            e.preventDefault();
            $("body").toggleClass("sidenav-toggled");
        });

        // Activate Feather icons
        feather.replace();

        // Activate Bootstrap scrollspy for the sticky nav component
        $("body").scrollspy({
            target: "#stickyNav",
            offset: 82,
        });

        // Scrolls to an offset anchor when a sticky nav link is clicked
        $('.nav-sticky a.nav-link[href*="#"]:not([href="#"])').click(function () {
            if (location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
                if (target.length) {
                    $("html, body").animate(
                        {
                            scrollTop: target.offset().top - 81,
                        },
                        200
                    );
                    return false;
                }
            }
        });

        // Click to collapse responsive sidebar
        $("#layoutSidenav_content").click(function () {
            const BOOTSTRAP_LG_WIDTH = 992;
            if (window.innerWidth >= 992) {
                return;
            }
            if ($("body").hasClass("sidenav-toggled")) {
                $("body").toggleClass("sidenav-toggled");
            }
        });

        // Init sidebar
        $(".nav-link").removeClass("active");
        let activatedPath = window.location.hash.substr(1);
        let targetAnchor = $(`[href="#${activatedPath}"]`);
        targetAnchor.addClass("active");
        let collapseAncestors = targetAnchor.parents(".collapse");
        collapseAncestors.each(function () {
            $(this).addClass("show");
            $('[data-target="#' + this.id + '"]').removeClass("collapsed");
        });

        collapseAncestors.each(function () {
            $(this).addClass("show");
            $('[data-target="#' + this.id + '"]').removeClass("collapsed");
        });
    })(jQuery);
};

const sbReInit = () => {
    $("body").removeClass("sidenav-toggled");
    $(".nav-link").removeClass("active");
    let activatedPath = window.location.hash.substr(1);
    let targetAnchor = $(`[href="#${activatedPath}"]`);
    targetAnchor.addClass("active");
    feather.replace();
};

const greetings = () => {
    let currentHours = new Date().getHours();
    if (currentHours >= 0 && currentHours <= 4) {
        return "Good Evening";
    } else if (currentHours > 4 && currentHours <= 11) {
        return "Good Morning";
    } else if (currentHours > 11 && currentHours <= 17) {
        return "Good Afternoon";
    } else {
        return "Good Evening";
    }
};

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

export { sbUtil, sbReInit, greetings, Toast };
