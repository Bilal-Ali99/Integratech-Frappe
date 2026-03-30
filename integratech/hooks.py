app_name = "integratech"
app_title = "IntegraTech"
app_publisher = "BTechno"
app_description = "Custom UI Layer for Frappe"
app_email = "bilal.ali1999@gmail.com"
app_license = "mit"

# ── Show as app on Frappe home screen ────────────────────────────────────────
add_to_apps_screen = [
    {
        "name": "integratech",
        "logo": "/assets/integratech/images/logo.svg",
        "title": "Integratech",
        "route": "/integratech",
        "has_permission": "integratech.api.permission.has_app_permission"
    }
]

# ── Inject custom theme into Frappe desk ─────────────────────────────────────
app_include_css = "/assets/integratech/css/custom_desk.css"
app_include_js  = "/assets/integratech/js/custom_desk.js"

website_route_rules = [
    {"from_route": "/integratech/<path:app_path>", "to_route": "integratech"},
]