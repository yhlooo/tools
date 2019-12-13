import json
import os
import sys

from tencent_cos import TencentCOSBucket
from aliyun_oss import AliyunOSSBucket
from utils import FileManager, OSSSynchronizer


if __name__ == '__main__':

    with open('config/keybrl-tools.json', 'rt', encoding='utf-8') as fp:
        cos = TencentCOSBucket(json.load(fp))

    local_file = FileManager('../dist')

    OSSSynchronizer(local_file, cos).sync_from_local_to_oss()
