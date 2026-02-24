$(document).ready(() => {
    apply_theme();
});

frappe.router.on("change", async () => {
    // wait until page is actually rendered
    setTimeout(() => {
        apply_theme();
    }, 300);
});




const apply_theme = async () => {
    const apply_to_workspace = await frappe.db.get_single_value("Theme Setting", "apply_workspace");
    const theme_color = await frappe.db.get_single_value("Theme Setting", "theme_color");
    const dark_view = await frappe.db.get_single_value("Theme Setting", "dark_view");

    const full_width = await frappe.db.get_single_value("Theme Setting", "full_width_workspace");
    document.body.classList.remove("full-width-workspace", "boxed-workspace");

    if (full_width) {
        document.body.classList.add("full-width-workspace");
    } else {
        document.body.classList.add("boxed-workspace");
    }


    if (dark_view === 1) {
        await frappe.require("/assets/second_theme/css/dark_view.css");


    } else {
        if (!apply_to_workspace || !theme_color) return;

        let color = "";
        let color2 = "";
        let color3 = "";

        if (theme_color === "Blue") { color = "#4F9DD9", color2 = "#c9e7fc", color3 = "#edf6fd" }
        else if (theme_color === "Green") { color = "#77942e", color2 = "#c3d48b", color3 = "#eaefc8" }
        else if (theme_color === "Yellow") { color = "#bbad0e", color2 = "#f1e981", color3 = "#fbffd1" }
        else if (theme_color === "Red") { color = "#e03636", color2 = "#f9c6c6", color3 = "#fff0f0" }
        else if (theme_color === "Default") { color = "#949494", color2 = "#bebebe", color3 = "#e4e4e4" }

        document.body.style.setProperty("--theme-color", color);
        document.body.style.setProperty("--theme-color2", color2);
        document.body.style.setProperty("--theme-color3", color3);




        await frappe.require("/assets/second_theme/css/custom_workspace.css");

    }

};