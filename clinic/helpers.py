def strong_password(e):
    special_list = [
        "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "[", "]", "{", "}", "?"
    ]
    special = 0
    number = 0
    alphabet = 0
    for i in e:
        if i in special_list:
            special += 1
        if i.isnumeric():
            number += 1
        if i.isalpha():
            alphabet += 1

    if special > 0 and number > 0 and alphabet > 0 and len(e.strip()) >= 6:
        return True
    return False


def user_right(level):
    level = int(level)
    all_rights = [
        'read_all_service_info',
        'add_people_info',
        'read_self_add_people_info',
        'add_company_info',
        'modify_people_info',
        'read_all_people_info',
        'add_service_info',
        'modify_service_info',
        'read_user_right',        
        'modify_user_right'
    ]
    
    user_rights = []
    if level > 0:
        user_rights.extend([
            all_rights[0],
            all_rights[1],
            all_rights[2],
            all_rights[3]
            ])
        if level > 1:
            user_rights.extend([
                all_rights[4],
                all_rights[5]
            ])
            if level > 2:
                user_rights.extend([
                    all_rights[6],
                    all_rights[7],
                    all_rights[8],
                    all_rights[9]
                ])
    
    return user_rights