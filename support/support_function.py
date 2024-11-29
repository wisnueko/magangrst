# support/support_function.py

import re

def check_is_email(email: str) -> bool:
    """Check if the provided string is a valid email address."""
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return bool(re.match(email_regex, email))
