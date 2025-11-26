#!/usr/bin/env python3
"""
CHANGELOG.md를 버전별 파일로 분리하는 스크립트
"""

import re
from pathlib import Path

# 경로 설정
sax_dir = Path(__file__).parent.parent
changelog_file = sax_dir / "CHANGELOG.md"
changelog_dir = sax_dir / "CHANGELOG"

# CHANGELOG.md 읽기
with open(changelog_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 헤더 추출 (첫 번째 버전 전까지)
header_match = re.search(r'^(.*?)(?=^## \[)', content, re.MULTILINE | re.DOTALL)
header = header_match.group(1).strip() if header_match else ""

# 버전별로 분리
version_pattern = r'^## \[([^\]]+)\] - (\d{4}-\d{2}-\d{2})\n(.*?)(?=^## \[|\Z)'
versions = re.findall(version_pattern, content, re.MULTILINE | re.DOTALL)

print(f"총 {len(versions)}개 버전 발견")

# 각 버전별 파일 생성
for version, date, body in versions:
    filename = f"{version}.md"
    filepath = changelog_dir / filename

    # 파일 내용 구성
    file_content = f"""# SAX v{version} - {date}

{body.strip()}
"""

    # 파일 쓰기
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(file_content)

    print(f"✅ {filename} 생성")

print(f"\n모든 버전 파일이 {changelog_dir}에 생성되었습니다.")
