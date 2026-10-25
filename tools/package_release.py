#!/usr/bin/env python3
"""Package an already-synced Windows app, not a full Code-OSS source build."""
import argparse, hashlib, json, os, pathlib, zipfile
EXCLUDED_DIRS = {'.git', '.shuncode', '.codegraph', 'user-data', 'logs', '__pycache__'}
# Local audit records contain absolute paths from the build machine. They are not
# shipped; their hashes are recorded in SHUNCODE_BUILD_INFO.json instead.
LOCAL_AUDIT_FILES = {'SOURCE_BUILD_RECEIPT.json', 'SOURCE_PRODUCT_AUDIT.json'}
def read_build_info(ext, version):
    """Accept both build kinds: the legacy incremental build writes build-info.json,
    the reconstructed source build writes an esbuild receipt next to the bundle."""
    info_path = ext / 'dist/build-info.json'
    if info_path.is_file():
        info = json.loads(info_path.read_text(encoding='utf-8-sig'))
        if info.get('version') != version:
            raise ValueError('Version or build metadata mismatch')
        return info
    source_path = ext / 'dist/extension.js.build.json'
    if not source_path.is_file():
        raise ValueError('Missing build metadata: neither build-info.json nor extension.js.build.json exists')
    source = json.loads(source_path.read_text(encoding='utf-8-sig'))
    return {
        'version': version,
        'buildKind': 'reconstructed-extension-source',
        'fullSourceBuild': False,
        'extensionBuild': {
            'entry': source.get('entry'),
            'input_count': source.get('input_count'),
            'output_sha256': source.get('output_sha256'),
        },
    }
def package(app, output, version):
    app, output = pathlib.Path(app).resolve(), pathlib.Path(output).resolve()
    if output == app or app in output.parents:
        raise ValueError('Output must be outside the app directory')
    if output.exists():
        raise FileExistsError('Refusing to overwrite an existing release archive')
    ext = app / 'resources/app/extensions/shuncode'
    manifest = json.loads((ext / 'package.json').read_text(encoding='utf-8-sig'))
    info = read_build_info(ext, version)
    if manifest['version'] != version:
        raise ValueError('Version or build metadata mismatch')
    if not (ext / 'src/bridge-security.js').is_file():
        raise ValueError('Security module missing')
    product_info_path = app / 'SOURCE_BUILD_INFO.json'
    if product_info_path.is_file():
        product_info = json.loads(product_info_path.read_text(encoding='utf-8-sig'))
        if product_info.get('version') not in (None, version):
            raise ValueError('Version or build metadata mismatch')
        for key in ('sourceRevision', 'sourceHash', 'sourceDirty', 'buildKind'):
            if product_info.get(key) is not None:
                info[key] = product_info[key]
        info['builtAt'] = product_info.get('assembledAt') or info.get('builtAt')
    receipt_path = app / 'SOURCE_BUILD_RECEIPT.json'
    if receipt_path.is_file():
        raw = receipt_path.read_bytes()
        receipt = json.loads(raw.decode('utf-8'))
        info['productReceipt'] = {
            'sha256': hashlib.sha256(raw).hexdigest(),
            'created_at': receipt.get('created_at'),
            'files': len(receipt.get('files', [])),
        }
    output.parent.mkdir(parents=True, exist_ok=True)
    staging = output.with_suffix(output.suffix + '.partial')
    if staging.exists():
        raise FileExistsError('Partial archive already exists; inspect it before retrying')
    skipped, count = [], 0
    try:
        with zipfile.ZipFile(staging, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as z:
            for directory, dirs, files in os.walk(app, followlinks=False):
                dirs[:] = sorted(d for d in dirs if d not in EXCLUDED_DIRS and not pathlib.Path(directory, d).is_symlink())
                for name in sorted(files):
                    file = pathlib.Path(directory, name)
                    relative = file.relative_to(app).as_posix()
                    if file.is_symlink() or name.endswith(('.lnk', '.shuncode-stage', '.bak')) or name in {'.env', 'auth.json', '.git-credentials', 'id_rsa', 'id_ed25519'} or name in LOCAL_AUDIT_FILES:
                        skipped.append(relative)
                        continue
                    z.write(file, relative)
                    count += 1
            z.writestr('SHUNCODE_BUILD_INFO.json', json.dumps(info, ensure_ascii=False, indent=2) + '\n')
        with zipfile.ZipFile(staging) as z:
            bad = z.testzip()
            if bad:
                raise ValueError('CRC check failed: ' + bad)
        os.replace(staging, output)
    except Exception:
        staging.unlink(missing_ok=True)
        raise
    digest = hashlib.sha256()
    with output.open('rb') as f:
        while chunk := f.read(4 * 1024 * 1024):
            digest.update(chunk)
    sha = digest.hexdigest()
    checksum = output.with_name(output.name + '.sha256')
    checksum.write_text(sha + '  ' + output.name + '\n', encoding='utf-8', newline='\n')
    return {'archive': str(output), 'bytes': output.stat().st_size, 'sha256': sha, 'files': count, 'skipped': skipped, 'fullSourceBuild': False}
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--app', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    config = json.loads((pathlib.Path(__file__).resolve().parent.parent / 'version.json').read_text())
    print(json.dumps(package(args.app, args.output, config['version']), ensure_ascii=False, indent=2), flush=True)
