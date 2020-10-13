import os
import re
from typing import List, Tuple


def parse_font_filename(filename: str) -> Tuple[str, str]:
    font_name = filename.split('.')[0]

    var_name = font_name.lower().replace(' ', '-')

    var_name = re.split('([0-9]+|[^0-9]+)', var_name)
    var_name = '-'.join([var_name_slice for var_name_slice in var_name if var_name_slice])

    var_name = [var_name_slice for var_name_slice in var_name.split('-') if var_name_slice]
    var_name = ''.join([
        (
            f'{var_name_slice[0].upper()}{var_name_slice[1:]}'
            if i > 0
            else var_name_slice
        )
        for i, var_name_slice
        in enumerate(var_name)
    ])

    if var_name[0] in '0123456789':
        num_str = [
            'zero', 'one', 'two', 'three', 'four',
            'five', 'six', 'seven', 'eight', 'nine'
        ][int(var_name[0])]
        var_name = f'{num_str}{var_name[1:]}'

    return var_name, font_name


def list_font_files(path: str) -> List[str]:
    return os.listdir(path)


def main():
    font_files_list = list_font_files('node_modules/figlet/importable-fonts/')

    for filename in font_files_list:
        var_name, font_name = parse_font_filename(filename)
        print(f'import {var_name} from \'figlet/importable-fonts/{font_name}\'')
        print(f'\'{font_name}\': {var_name},')


if __name__ == '__main__':
    main()
