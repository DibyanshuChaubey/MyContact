import re
from flask import jsonify

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    """Validate phone (10+ digits)"""
    cleaned = re.sub(r'[\s\-\(\)\.]+', '', phone)
    return len(cleaned) >= 10 and cleaned.isdigit()

def error(msg, code=400):
    """Return error response"""
    return jsonify({'success': False, 'message': msg}), code

def success(data=None, msg='Success', code=200):
    """Return success response"""
    return jsonify({'success': True, 'message': msg, 'data': data}), code
