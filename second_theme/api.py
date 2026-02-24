import frappe

def website_boot(context):
    context["boot"].setdefault("theme_setting", frappe.get_single("Theme Setting").as_dict())
    pass


