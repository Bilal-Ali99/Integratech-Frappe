import frappe

def has_app_permission():
    """Allow access to any logged-in user."""
    if frappe.session.user == "Guest":
        return False
    return True
