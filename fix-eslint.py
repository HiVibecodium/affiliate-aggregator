#!/usr/bin/env python3
"""
Fix ESLint warnings automatically
"""
import re
import os
from pathlib import Path

def fix_unused_request_params(file_path):
    """Fix unused request parameters in API routes"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Fix unused request parameter
    content = re.sub(
        r'export async function (POST|GET|PUT|DELETE|PATCH)\(request: Request\)',
        r'export async function \1(_request: Request)',
        content
    )

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def fix_unused_error_params(file_path):
    """Fix unused error parameters in catch blocks"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Fix unused error in catch blocks that don't use it
    lines = content.split('\n')
    new_lines = []

    for i, line in enumerate(lines):
        # Check if this is a catch block with unused error
        if '} catch (error) {' in line or '} catch(error) {' in line:
            # Look ahead to see if error is used in the block
            block_end = i + 1
            uses_error = False
            brace_count = 1

            for j in range(i + 1, len(lines)):
                if '{' in lines[j]:
                    brace_count += lines[j].count('{')
                if '}' in lines[j]:
                    brace_count -= lines[j].count('}')

                if brace_count == 0:
                    block_end = j
                    break

                # Check if error is used (not in comments)
                if 'error' in lines[j] and not lines[j].strip().startswith('//'):
                    if 'console.error' in lines[j] or 'error.' in lines[j] or 'error)' in lines[j] or 'error instanceof' in lines[j]:
                        uses_error = True
                        break

            if not uses_error:
                line = line.replace('} catch (error) {', '} catch (_error) {')
                line = line.replace('} catch(error) {', '} catch (_error) {')

        new_lines.append(line)

    content = '\n'.join(new_lines)

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def fix_unused_vars(file_path):
    """Fix common unused variable patterns"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Fix specific cases based on ESLint output
    replacements = [
        # API routes
        (r'async function syncHandler\(_request: NextRequest\)', r'async function syncHandler(_request: NextRequest)'),
        (r'export async function GET\(request: Request\)', r'export async function GET(_request: Request)'),

        # Components
        (r'const { Legend }', r'const { Legend: _Legend }'),
        (r'import.*isRole.*from', r'// Unused import: isRole'),
    ]

    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    base_dir = Path(__file__).parent

    # Files to fix
    api_files = list((base_dir / 'app' / 'api').rglob('*.ts'))
    page_files = list((base_dir / 'app').rglob('page.tsx'))
    component_files = list((base_dir / 'components').rglob('*.tsx'))

    all_files = api_files + page_files + component_files

    fixed_count = 0

    for file_path in all_files:
        changed = False
        changed |= fix_unused_request_params(str(file_path))
        changed |= fix_unused_error_params(str(file_path))
        changed |= fix_unused_vars(str(file_path))

        if changed:
            fixed_count += 1
            print(f"Fixed: {file_path.relative_to(base_dir)}")

    print(f"\nTotal files fixed: {fixed_count}")

if __name__ == '__main__':
    main()
