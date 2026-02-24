// kamel Ahmed

// hide defult system sidebar
// ======================== hide sidebar function ========================
const hideSidebar = async () => {
    const toggle_button = document.querySelector("#side-toggle")
    var sidebar_status = true
    const sub_menu_content = document.querySelector("#sub-menu-content");
    toggle_button.innerHTML = ""
    toggle_button.innerHTML = frappe.utils.icon("sidebar-collapse" || "home", "sm");

    // on route change refresh sidebar
    frappe.router.on('change', () => {
        sidebar_status ? get_sidebar_items() : null;
        sub_menu_content.innerHTML = ""
        if (sub_shortcuts_btn && sub_shortcuts_btn.classList.contains("active")) {
            get_sub_shortcuts_items()
        } else if (sub_menu_btn && sub_menu_btn.classList.contains("active")) {
            get_sub_menu_items()
        }
    })

    toggle_button.addEventListener("click", () => {

        sidebar_status = !sidebar_status


        if (!sidebar_status) {
            toggle_button.innerHTML = frappe.utils.icon("sidebar-expand" || "home", "sm");
            toggle_button.style.marginLeft = "2px"
            document.querySelector("#side-menu-component").style.display = "none"
            document.querySelector("#side-menu-perent").style.minWidth = "fit-content"
        } else {
            get_sidebar_items();
            toggle_button.innerHTML = frappe.utils.icon("sidebar-collapse" || "home", "sm");
            toggle_button.style.marginLeft = "65px"
            document.querySelector("#side-menu-component").style.display = "block"
            document.querySelector("#side-menu-perent").style.minWidth = "65px"
        }

    })


}
// ======================== End hide sidebar function ========================

// ======================== start custom sidebar (get_sidebar_items) ========================
// ===== Global TOOLTIP =====
let sidebarTooltip = document.getElementById("sidebar-tooltip");

if (!sidebarTooltip) {
    sidebarTooltip = document.createElement("div");
    sidebarTooltip.id = "sidebar-tooltip";

    sidebarTooltip.style.position = "fixed";
    sidebarTooltip.style.padding = "5px 10px";
    sidebarTooltip.style.background = "black";
    sidebarTooltip.style.color = "white";
    sidebarTooltip.style.fontSize = "12px";
    sidebarTooltip.style.borderRadius = "6px";
    sidebarTooltip.style.pointerEvents = "none";
    sidebarTooltip.style.opacity = "0";
    sidebarTooltip.style.transition = "opacity 0.15s ease";
    sidebarTooltip.style.zIndex = "99999";
    sidebarTooltip.style.whiteSpace = "nowrap";

    document.body.appendChild(sidebarTooltip);
}

const get_sidebar_items = async () => {
    try {
        const response = await fetch(
            '/api/method/frappe.desk.desktop.get_workspace_sidebar_items'
        );

        if (!response.ok) {
            const sideMenuParent = document.querySelector("#side-menu-perent");
            sideMenuParent.style.display = "none";
            document.querySelector(".layout-side-section").style.setProperty("display", "block", "important");
            document.querySelector(".sidebar-toggle-btn").style.setProperty("display", "block", "important");
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();  // sidebar data 
        const sidebar_items = data?.message?.pages || [];
        const theme_setting_doc = await frappe.db.get_doc("Theme Setting", "Theme Setting");
        const system_sidebar = await frappe.db.get_single_value("Theme Setting", "default_sidebar");
        const apply_to_sidebar = await frappe.db.get_single_value("Theme Setting", "apply_sidebar")

        const theme_color = theme_setting_doc.theme_color;


        // handle active item background color
        const themeItemColors = {
            Default: { bg: "#e5e5e5", text: "black" },
            Blue: { bg: "#c9e7fc", text: "black" },
            Green: { bg: "#87d887", text: "black" },
            Yellow: { bg: "#cccc00", text: "black" },
            Red: { bg: "#f9c6c6", text: "black" },
        };

        // default when theme is empty or invalid
        const activeTheme = themeItemColors[theme_color]
            ? themeItemColors[theme_color]
            : {
                bg: "#e5e5e5",   // ✅ default bg
                text: "black",   // ✅ default text
            };

        if (system_sidebar == 0) {
            // document.querySelector(".layout-side-section").style.display = "none"
            // document.querySelector(".sidebar-toggle-btn").style.display = "none"
            document.querySelector("#side-menu-perent").style.display = "block"
            document.querySelector("#side-menu-component").style.display = "block"
            // let theme_color1 = "#4F9DD9"

            theme_color == "" ?
                document.querySelector("#side-menu-perent").style.color = "black"
                :
                document.querySelector("#side-menu-perent").style.color = "white"
                ;
        }

        const dark_view = await frappe.db.get_single_value("Theme Setting", "dark_view");
        // console.log(dark_view);

        if (dark_view) {
            await frappe.require("/assets/second_theme/css/dark_view.css")
        } else {

            if (apply_to_sidebar) {

                if (theme_color === "Blue") {
                    let theme_color1 = "#4F9DD9"
                    document.querySelector("#side-menu-perent").style.backgroundColor = theme_color1
                } else if (theme_color === "Green") {
                    let theme_color1 = "#77942e"
                    document.querySelector("#side-menu-perent").style.backgroundColor = theme_color1
                } else if (theme_color === "Yellow") {
                    let theme_color1 = "#bbad0e"
                    document.querySelector("#side-menu-perent").style.backgroundColor = theme_color1
                } else if (theme_color === "Red") {
                    let theme_color1 = "#e03636"
                    document.querySelector("#side-menu-perent").style.backgroundColor = theme_color1
                } else if (theme_color === "Default") {
                    let theme_color1 = "#949494"
                    document.querySelector("#side-menu-perent").style.backgroundColor = theme_color1
                }
            } else {
                document.querySelector("#side-menu-perent").style.border = "0.5px solid lightgray"
                document.querySelector("#side-menu-perent").style.color = "black"
            }
        }


        // =================================== system_sidebar (default sidebar) is true ===================================
        if (system_sidebar == 1) {
            // document.querySelector(".layout-side-section").style.display = "block"
            // document.querySelector(".sidebar-toggle-btn").style.display = "block"
            document.querySelector("#side-menu-perent").style.display = "none"
            document.querySelector("#side-menu-component").style.display = "none"
            document.querySelector("#sub-menu").style.display = "none" // hide sub menu
        }
        // =================================== system_sidebar (default sidebar) is true ===================================


        // جلب القيمة الحديثة من Theme Setting
        const showLabel = await frappe.db.get_single_value("Theme Setting", "show_icon_lable");
        const menu_type = await frappe.db.get_single_value("Theme Setting", "menu_opening_type");
        const icon_tooltip = await frappe.db.get_single_value("Theme Setting", "hide_icon_tooltip");
        // console.log(icon_tooltip);


        const main_sidebar_place = document.querySelector("#side-menu-component");
        if (!main_sidebar_place) return;
        main_sidebar_place.innerHTML = "";

        const route_str = (frappe.get_route_str()).toLowerCase().replace(/\s+/g, "-");

        sidebar_items.forEach(item => {
            const link = document.createElement("div");
            link.classList.add("side-menu-item");

            // sidebar layout style 
            link.style.display = "flex";
            link.style.justifyContent="center"
            link.style.flexDirection = "column";
            link.style.alignItems = "center";
            // link.style.margin = "8px 12px";
            link.style.padding = "5px 2px";
            link.style.cursor = "pointer";
            link.style.gap = "6px";
            link.style.borderRadius = "6px";
            link.style.transition = "background-color 0.5s";


            const item_route = item.name.toLowerCase().replace(/\s+/g, "-");


            // --- إضافة Class active إذا كان هو المسار الحالي عند التحميل ---
            if (route_str.includes(item_route)) {
                link.classList.add("active");
                if (dark_view === 1) {
                    link.style.backgroundColor = "gray"
                    link.style.color = "#fff"
                } else {
                    link.style.backgroundColor = activeTheme.bg
                    link.style.color = activeTheme.text;
                }
            }

            // custom Icons
            const custom_icons = theme_setting_doc?.menu_icons || [];

            // find matching custom icon by label
            const customIcon = custom_icons.find(
                icon => icon.sidebar_label === item.label
            );

            // create icon wrapper
            const iconWrapper = document.createElement("div");


            if (customIcon && customIcon.icon) {
                iconWrapper.innerHTML = frappe.utils.icon(customIcon.icon || "home", "lg");
            } else {
                iconWrapper.innerHTML = frappe.utils.icon(item.icon || "home", "lg");
            }

            link.appendChild(iconWrapper);

            // label 
            if (showLabel == 1) {
                const title = document.createElement("span");
                title.textContent = (item.title).length > 8 ? (item.title).substring(0, 5) + "..." : item.title;
                title.style.fontSize = "12px";
                link.appendChild(title);
            } else {
                iconWrapper.style.padding = "5px 10px"
                iconWrapper.style.margin = "0 10px"
            }


            if (icon_tooltip != true) {

                link.addEventListener("mouseenter", (e) => {
                    sidebarTooltip.textContent = item.title;
                    sidebarTooltip.style.opacity = "1";

                    // position beside icon (professional style)
                    const rect = link.getBoundingClientRect();
                    // console.log(rect);

                    sidebarTooltip.style.left = rect.right - 5  + "px";
                    sidebarTooltip.style.top = rect.top + rect.height / 2 - 12 + "px";
                });

                link.addEventListener("mouseleave", () => {
                    sidebarTooltip.style.opacity = "0";
                });

            } else {
                // fallback to native tooltip
                link.title = item.title;
            }




            // routing & active class toggle ==============================================================================================

            link.addEventListener("click", () => {

                document.querySelectorAll(".side-menu-item").forEach(el => {
                    el.classList.remove("active");
                    el.style.backgroundColor = "transparent";
                    el.style.color = "inherit";
                });
                link.classList.add("active");

                if (dark_view) {
                    link.style.backgroundColor = "gray"
                    link.style.color = "#fff"

                } else {
                    link.style.backgroundColor = activeTheme.bg
                    link.style.color = activeTheme.text;
                }

                if (menu_type === "Workspace") {
                    frappe.set_route(item_route);
                } else if (menu_type === "Dashboard") {
                    frappe.set_route("dashboard-view", item_route);
                    console.log(item_route);

                }
            });



            main_sidebar_place.appendChild(link);
        });

    } catch (error) {
        console.error('An error occurred while fetching sidebar items:', error);
    }
};
// ========================   end custom sidebar (get_sidebar_items) ========================


// ======================== start sub sidebar toggle =========================
const hideSubSidebar = async () => {
    const sub_toggle_button = document.querySelector("#sub-side-toggle")
    sub_toggle_button.innerHTML = ""
    sub_toggle_button.innerHTML = frappe.utils.icon("menu" || "home", "sm");

    let sub_sidebar_status = await frappe.db.get_single_value("Theme Setting", "always_close_sub_menu");
    const apply_to_sub_sidebar = await frappe.db.get_single_value("Theme Setting", "apply_sub_sidebar");

    const theme_color = await frappe.db.get_single_value("Theme Setting", "theme_color");
    const dark_view = await frappe.db.get_single_value("Theme Setting", "dark_view");

    if (dark_view === 1) {
        await frappe.require("/assets/second_theme/css/dark_view.css");
    } else {

        if (apply_to_sub_sidebar) {
            // color gradient 

            if (theme_color === "Blue") {
                let theme_color2 = "#c9e7fc"
                document.querySelector("#sub-menu").style.backgroundColor = theme_color2
            } else if (theme_color === "Green") {
                let theme_color2 = "#c3d48b"
                document.querySelector("#sub-menu").style.backgroundColor = theme_color2
            } else if (theme_color === "Yellow") {
                let theme_color2 = "#f1e981"
                document.querySelector("#sub-menu").style.backgroundColor = theme_color2
            } else if (theme_color === "Red") {
                let theme_color2 = "#f9c6c6"
                document.querySelector("#sub-menu").style.backgroundColor = theme_color2
            } else if (theme_color === "Default") {
                let theme_color2 = "#bebebe"
                document.querySelector("#sub-menu").style.backgroundColor = theme_color2

            }
        } else {
            document.querySelector("#sub-menu").style.border = "0.5px solid lightgray"
        }
    }




    // always_close_sub_menu function (true or false)
    const sub_menu_toggle_fun = () => {
        if (sub_sidebar_status) {
            sub_toggle_button.innerHTML = frappe.utils.icon("menu" || "home", "sm");
            sub_toggle_button.style.marginLeft = "2px"
            document.querySelector("#sub-menu").style.minWidth = "0px"
            document.querySelector("#sub-menu-component").style.display = "none"
            document.querySelector("#sub-menu-component").style.maxWidth = "fit-content"
        } else {

            sub_toggle_button.innerHTML = frappe.utils.icon("sidebar-collapse" || "home", "sm");
            sub_toggle_button.style.marginLeft = "200px"
            document.querySelector("#sub-menu").style.minWidth = "200px"
            document.querySelector("#sub-menu-component").style.display = "block"
            document.querySelector("#sub-menu-component").style.maxWidth = "220px"
        }
    }

    sub_menu_toggle_fun()


    sub_toggle_button.addEventListener("click", () => {
        sub_sidebar_status = !sub_sidebar_status
        // console.log(sub_sidebar_status);
        sub_menu_toggle_fun()

    })


}
// ======================== End sub sidebar toggle =========================



// ========================= start sub sidebar get (shortcuts & cards)======================================
const sub_menu_btn = document.querySelector("#sub-menu-btn");
const sub_shortcuts_btn = document.querySelector("#sub-shortcuts-btn");
const sub_menu_content = document.querySelector("#sub-menu-content"); // menu and shortcut content

sub_menu_btn.addEventListener("click", () => {
    setActiveSubTab(sub_menu_btn);
    sub_menu_content.innerHTML = "";
    get_sub_menu_items();
    // console.log("menu card items");

});

sub_shortcuts_btn.addEventListener("click", () => {
    setActiveSubTab(sub_shortcuts_btn);
    sub_menu_content.innerHTML = "";
    get_sub_shortcuts_items();
});


const setActiveSubTab = (activeBtn) => {
    document.querySelectorAll(".sub-tab-btn").forEach(btn => { 
        btn.classList.remove("active");
        btn.disabled = false;   // enable all first
    });

    activeBtn.classList.add("active");
    activeBtn.disabled = true; // disable active button
};

// get shortcuts items
const get_sub_shortcuts_items = async () => {
    try {
        const route = frappe.get_route() || [];
        const cur_route = route.length > 1 ? route[1] : null;

        if (!cur_route) {
            console.warn("No route found for shortcuts");
            return;
        }

        const page = JSON.stringify({ name: cur_route });


        const response = await fetch(
            `/api/method/frappe.desk.desktop.get_desktop_page?page=${encodeURIComponent(page)}`
        );


        document.querySelector("#page-title").innerHTML = cur_route;
        const data = await response.json();
        // console.log("data", data);


        const shortcuts_items = data?.message?.shortcuts?.items || [];

        // const menu_items = data?.message?.cards?.items || [];

        shortcuts_items.forEach(item => {
            const li = document.createElement("li");
            li.classList.add("sub-menu-item");

            // li.style.color = "black";
            li.style.border = "1px solid black";
            li.style.margin = "10px 0";
            li.style.display = "flex";
            li.style.justifyContent = "space-between";
            li.style.alignItems = "center";
            li.style.cursor = "pointer";

            // Label
            const label = document.createElement("span");
            label.textContent = item.label.slice(0, 20) + (item.label.length > 20 ? "..." : "");
            label.title = item.label;
            label.style.fontSize = "11px";

            // Icon 
            const iconWrapper = document.createElement("span");
            iconWrapper.innerHTML = frappe.utils.icon("external-link", "xs");

            li.appendChild(label);
            li.appendChild(iconWrapper);

            li.addEventListener("click", () => {
                // External URL
                if (item.type === "URL" && item.url) {
                    window.location.href = item.url;
                    return;
                }
                // DocType (List View)
                if (item.type === "DocType" && item.link_to) {
                    frappe.set_route("List", item.link_to);
                    return;
                }
                // Report
                if (item.type === "Report" && item.link_to) {
                    frappe.set_route("query-report", item.link_to);
                    return;
                }
                // Page
                if (item.type === "Page" && item.link_to) {
                    frappe.set_route("page", item.link_to);
                    return;
                }
                // Dashboard
                if (item.type === "Dashboard" && item.link_to) {
                    frappe.set_route("dashboard-view", item.link_to);
                    return;
                }
                // Fallback (safe)
                if (item.link_to) {
                    frappe.set_route(item.link_to);
                }
            });
            sub_menu_content.appendChild(li);
        });

    } catch (error) {
        console.error(error);
    }
};

// get menu card item
const get_sub_menu_items = async () => {
    try {
        const route = frappe.get_route() || [];
        const cur_route = route.length > 1 ? route[1] : null;
        if (!cur_route) return;

        const page = JSON.stringify({ name: cur_route });

        const response = await fetch(
            `/api/method/frappe.desk.desktop.get_desktop_page?page=${encodeURIComponent(page)}`
        );

        const data = await response.json();
        const cards = data?.message?.cards?.items || [];


        const container = document.querySelector("#sub-menu-content");
        if (!container) return;

        container.innerHTML = ""; // reset

        cards.forEach(card => {
            // ---- Accordion Wrapper ----
            const accordionItem = document.createElement("div");
            accordionItem.classList.add("accordion-item");

            // ---- Accordion Header ----
            const header = document.createElement("div");
            header.classList.add("accordion-header");
            header.textContent = card.label;

            // ---- Accordion Body ----
            const body = document.createElement("ul");
            body.classList.add("accordion-body");

            // ---- Links inside card ----
            (card.links || []).forEach(link => {
                const li = document.createElement("li");
                li.classList.add("sub-menu-link");
                li.textContent = link.label || link.name;

                li.addEventListener("click", (e) => {
                    e.stopPropagation();

                    if (link.link_type === "URL" && link.url) {
                        window.open(link.url, "_blank");
                        return;
                    }
                    if (link.link_type === "DocType" && link.link_to) {
                        frappe.set_route("List", link.link_to);
                        return;
                    }
                    if (link.link_type === "Report" && link.link_to) {
                        frappe.set_route("query-report", link.link_to);
                        return;
                    }
                    if (link.link_type === "Page" && link.link_to) {
                        frappe.set_route("page", link.link_to);
                        return;
                    }
                    if (link.link_to) {
                        frappe.set_route("Form", link.link_to);
                    }
                });

                body.appendChild(li);
            });

            // ---- Toggle behavior (slide + single open) ----
            header.addEventListener("click", () => {
                const allBodies = container.querySelectorAll(".accordion-body");
                const allHeaders = container.querySelectorAll(".accordion-header");

                const isOpen = body.style.maxHeight && body.style.maxHeight !== "0px";

                // Close all
                allBodies.forEach(b => b.style.maxHeight = "0px");
                allHeaders.forEach(h => h.classList.remove("open"));

                // Open clicked
                if (!isOpen) {
                    body.style.maxHeight = body.scrollHeight + "px";
                    header.classList.add("open");
                }
            });

            accordionItem.appendChild(header);
            accordionItem.appendChild(body);
            container.appendChild(accordionItem);
        });

    } catch (error) {
        console.error("Sub menu cards error:", error);
    }
};


// ========================= End sub sidebar ======================================


const showSidebarsAfterLoad = async () => {
    // wait for frappe boot + workspace
    // await frappe.after_ajax();

    document.body.classList.remove("app-loading");


    // now run your sidebar logic

    hideSidebar();
    hideSubSidebar();
    get_sidebar_items();
    get_sub_shortcuts_items()

    // apply_dark()

};

$(document).ready(showSidebarsAfterLoad);