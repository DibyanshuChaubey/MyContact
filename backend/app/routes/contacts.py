from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Contact
from app.utils import validate_email, validate_phone, error, success

contacts_bp = Blueprint('contacts', __name__, url_prefix='/api/contacts')


@contacts_bp.route('', methods=['POST'])
@jwt_required()
def create_contact():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    if not data.get('name') or not data.get('email') or not data.get('phone'):
        return error('Missing required fields', 400)

    if not validate_email(data['email']):
        return error('Invalid email', 400)

    if not validate_phone(data['phone']):
        return error('Invalid phone', 400)

    contact = Contact(
        user_id=user_id,
        name=data['name'].strip(),
        email=data['email'].strip(),
        phone=data['phone'].strip(),
        address=(data.get('address') or '').strip() or None,
    )

    db.session.add(contact)
    db.session.commit()

    return success(contact.to_dict(), 'Contact created', 201)


@contacts_bp.route('', methods=['GET'])
@jwt_required()
def get_contacts():
    user_id = int(get_jwt_identity())
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search = (request.args.get('search') or '').strip()
    sort_by = request.args.get('sort_by', 'created_at')

    query = Contact.query.filter_by(user_id=user_id)

    if search:
        query = query.filter(
            (Contact.name.ilike(f'%{search}%')) | (Contact.email.ilike(f'%{search}%'))
        )

    if sort_by == 'name':
        query = query.order_by(Contact.name.asc())
    elif sort_by == 'email':
        query = query.order_by(Contact.email.asc())
    else:
        query = query.order_by(Contact.created_at.desc())

    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return success({
        'contacts': [c.to_dict() for c in paginated.items],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': paginated.total,
            'pages': paginated.pages,
        },
    })


@contacts_bp.route('/<int:contact_id>', methods=['GET'])
@jwt_required()
def get_contact(contact_id):
    user_id = int(get_jwt_identity())
    contact = Contact.query.filter_by(id=contact_id, user_id=user_id).first()
    if not contact:
        return error('Contact not found', 404)
    return success(contact.to_dict())


@contacts_bp.route('/<int:contact_id>', methods=['PUT'])
@jwt_required()
def update_contact(contact_id):
    user_id = int(get_jwt_identity())
    contact = Contact.query.filter_by(id=contact_id, user_id=user_id).first()
    if not contact:
        return error('Contact not found', 404)

    data = request.get_json() or {}

    if 'name' in data and data['name']:
        contact.name = data['name'].strip()
    if 'email' in data and data['email']:
        if not validate_email(data['email']):
            return error('Invalid email', 400)
        contact.email = data['email'].strip()
    if 'phone' in data and data['phone']:
        if not validate_phone(data['phone']):
            return error('Invalid phone', 400)
        contact.phone = data['phone'].strip()
    if 'address' in data:
        contact.address = (data.get('address') or '').strip() or None

    db.session.commit()
    return success(contact.to_dict(), 'Contact updated')


@contacts_bp.route('/<int:contact_id>', methods=['DELETE'])
@jwt_required()
def delete_contact(contact_id):
    user_id = int(get_jwt_identity())
    contact = Contact.query.filter_by(id=contact_id, user_id=user_id).first()
    if not contact:
        return error('Contact not found', 404)

    db.session.delete(contact)
    db.session.commit()
    return success(None, 'Contact deleted')
