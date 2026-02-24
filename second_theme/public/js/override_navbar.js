// 
$(document).ready(async function () {


    navbarMethods()
    toggleModeNav()
    togglelanguage()

});

// navebar show_help_icon, apply_to_navebar, theme_color, theme_logo, favicon, dark_view
const navbarMethods = async () => {
    const show_help_icon = await frappe.db.get_single_value("Theme Setting", "show_help_icon")
    const apply_to_navebar = await frappe.db.get_single_value("Theme Setting", "apply_navbar")
    const theme_color = await frappe.db.get_single_value("Theme Setting", "theme_color");
    const theme_logo = await frappe.db.get_single_value("Theme Setting", "theme_logo");
    const favicon_img = await frappe.db.get_single_value("Theme Setting", "favicon");
    const dark_view = await frappe.db.get_single_value("Theme Setting", "dark_view");

    theme_logo ?
        document.querySelector(".navbar .navbar-brand ").innerHTML =
        `<img src="${theme_logo}" alt="Logo" style="width:35px ; height:35px" >`
        :
        (
            favicon_img ?
                document.querySelector(".navbar .navbar-brand ").innerHTML =
                `<img src="${favicon_img}" alt="favicon logo" style="width:35px ; height:35px" >`
                :
                null
        )

    show_help_icon ? null : document.querySelector(".dropdown-help").innerHTML = ""


    // Navebar dark view
    if (dark_view === 1) {
        await frappe.require("/assets/second_theme/css/dark_view.css");
    } else {
        if (apply_to_navebar) {
            // color gradient 
            if (theme_color === "Blue") {
                let theme_color2 = "#c9e7fc"
                document.querySelector(".navbar").style.backgroundColor = theme_color2
            } else if (theme_color === "Green") {
                let theme_color2 = "#c3d48b"
                document.querySelector(".navbar").style.backgroundColor = theme_color2
            } else if (theme_color === "Yellow") {
                let theme_color2 = "#f1e981"
                document.querySelector(".navbar").style.backgroundColor = theme_color2
            } else if (theme_color === "Red") {
                let theme_color2 = "#f9c6c6"
                document.querySelector(".navbar").style.backgroundColor = theme_color2
            } else if (theme_color === "Default") {
                let theme_color2 = "#bebebe"
                document.querySelector(".navbar").style.backgroundColor = theme_color2
            }

        } else {
            document.querySelector(".navbar").style.border = "0.5px solid lightgray"
        }

    }
}

// Light & Dark Mode in Navbar
const toggleModeNav = async () => {
    const target = document.querySelector(".vertical-bar");
    const darkModeToggle = document.createElement("div");
    darkModeToggle.classList.add("toggle-mode-btn");
    let currentMode = await frappe.db.get_single_value("Theme Setting", "dark_view");

    // create icon element
    const icon = document.createElement("img");
    icon.style.width = "16px";
    icon.style.height = "25px";
    // icon.style.marginRight = "6px";

    if (currentMode) {
        darkModeToggle.style.color = "#fff";
        icon.src = "/assets/second_theme/icons/sun.svg";
    } else {
        icon.src = "/assets/second_theme/icons/moon.svg";
        // icon.style.fill = "#ffffff"
    }

    darkModeToggle.prepend(icon);

    darkModeToggle.style.margin = "auto 5px";
    target.insertAdjacentElement("beforeend", darkModeToggle);

    darkModeToggle.addEventListener("click", async () => {

        // Get current dark_view value (custom theme setting)
        let dark_view_value = await frappe.db.get_single_value("Theme Setting", "dark_view");

        dark_view_value = !dark_view_value;

        // Update Theme Setting correctly
        await frappe.call({
            method: "frappe.client.set_value",
            args: {
                doctype: "Theme Setting",
                name: "Theme Setting",
                fieldname: {
                    dark_view: dark_view_value
                }
            }
        });

        // Convert boolean to desk_theme value
        let deskThemeValue = ""
        dark_view_value ? deskThemeValue = "Dark" : deskThemeValue = "Light";

        // Update User desk theme
        await frappe.call({
            method: "frappe.client.set_value",
            args: {
                doctype: "User",
                name: frappe.session.user,
                fieldname: "desk_theme",
                value: deskThemeValue
            }
        });

        // Reload once
        location.reload();
    });
};

// Language Toggle in Navbar
const togglelanguage = async () => {
    const target = document.querySelector(".vertical-bar");
    const languageToggle = document.createElement("li");
    languageToggle.classList.add("toggle-language-btn");

    let currentLanguage = frappe.boot.lang
    // console.log(currentLanguage);
    

    // create icon element
    const icon = document.createElement("img");
    icon.style.width = "18px";
    icon.style.borderRadius = "10px";
    // icon.style.marginRight = "6px";

    if (currentLanguage === "en") {
        icon.src = "/assets/second_theme/icons/eg.svg";
        languageToggle.textContent = "AR"
        languageToggle.addEventListener("click", async () => {

        // change language to Arabic
        frappe.call({
            method: "frappe.client.set_value",
            args: {
                doctype: "User",
                name: frappe.session.user,
                fieldname: "language",
                value: "ar"
            },
            callback: function () {
                location.reload();
            }
        });
    })
    } else if (currentLanguage === "ar") {
        languageToggle.textContent = "EN"
        icon.src = "/assets/second_theme/icons/gb.svg";
        languageToggle.addEventListener("click", async () => {

        // change language to English
        frappe.call({
            method: "frappe.client.set_value",
            args: {
                doctype: "User",
                name: frappe.session.user,
                fieldname: "language",
                value: "en"
            },
            callback: function () {
                location.reload();
            }
        });
    })
    }

    languageToggle.prepend(icon);

    languageToggle.style.margin = "auto 5px";
    target.insertAdjacentElement("afterend", languageToggle);

    
};
