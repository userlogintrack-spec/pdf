"""
Delete old uploaded files + orphaned preview outputs.

Usage:
    python manage.py cleanup_uploads
    python manage.py cleanup_uploads --hours 24          # retention window
    python manage.py cleanup_uploads --dry-run           # show what would go
    python manage.py cleanup_uploads --hours 1 --verbose # aggressive + verbose

Schedule via cron (every hour):
    0 * * * * cd /path/to/backend && python manage.py cleanup_uploads --hours 24
"""
import os
import time
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.documents.models import Document


class Command(BaseCommand):
    help = 'Delete old uploaded files + orphaned preview outputs older than --hours.'

    def add_arguments(self, parser):
        parser.add_argument('--hours', type=int, default=24,
                            help='Delete files older than this many hours (default: 24).')
        parser.add_argument('--dry-run', action='store_true',
                            help='Report what would be deleted without actually deleting.')
        parser.add_argument('--verbose', action='store_true',
                            help='Log each deleted path.')

    def handle(self, *args, **opts):
        hours = opts['hours']
        dry = opts['dry_run']
        verbose = opts['verbose']
        cutoff = time.time() - hours * 3600

        upload_dir = Path(settings.BASE_DIR) / 'uploads'
        outputs_dir = upload_dir / 'outputs'

        deleted_files = 0
        freed_bytes = 0
        deleted_docs = 0

        # 1. Delete DB Document rows whose created_at is old, and their files
        old_docs = Document.objects.filter(
            created_at__lt=timezone.now() - timezone.timedelta(hours=hours)
        )
        for doc in old_docs:
            try:
                path = None
                try:
                    path = doc.file.path
                except Exception:
                    path = doc.file.name
                if path and os.path.exists(path):
                    size = os.path.getsize(path)
                    if not dry:
                        os.unlink(path)
                    deleted_files += 1
                    freed_bytes += size
                    if verbose:
                        self.stdout.write(f'  [doc-file] {path} ({size} B)')
                if not dry:
                    doc.delete()
                deleted_docs += 1
            except Exception as e:
                self.stderr.write(f'  [skip doc {doc.id}] {e}')

        # 2. Sweep outputs/ directory for files older than cutoff (orphaned previews)
        if outputs_dir.exists():
            for entry in outputs_dir.iterdir():
                if not entry.is_file():
                    continue
                try:
                    mtime = entry.stat().st_mtime
                    if mtime < cutoff:
                        size = entry.stat().st_size
                        if not dry:
                            entry.unlink()
                        deleted_files += 1
                        freed_bytes += size
                        if verbose:
                            self.stdout.write(f'  [output] {entry} ({size} B)')
                except Exception as e:
                    self.stderr.write(f'  [skip output {entry.name}] {e}')

        # 3. Sweep stray files directly in uploads/ (not in outputs/) that are
        #    not referenced by any remaining Document row.
        referenced_names = set()
        for doc in Document.objects.all():
            try:
                name = doc.file.name
                if name:
                    referenced_names.add(os.path.basename(name))
            except Exception:
                pass

        if upload_dir.exists():
            for entry in upload_dir.iterdir():
                if not entry.is_file():
                    continue
                if entry.name in referenced_names:
                    continue
                try:
                    mtime = entry.stat().st_mtime
                    if mtime < cutoff:
                        size = entry.stat().st_size
                        if not dry:
                            entry.unlink()
                        deleted_files += 1
                        freed_bytes += size
                        if verbose:
                            self.stdout.write(f'  [orphan] {entry} ({size} B)')
                except Exception as e:
                    self.stderr.write(f'  [skip orphan {entry.name}] {e}')

        mb = freed_bytes / (1024 * 1024)
        prefix = '[DRY-RUN] Would delete' if dry else 'Deleted'
        self.stdout.write(self.style.SUCCESS(
            f'{prefix}: {deleted_docs} docs, {deleted_files} files, '
            f'{mb:.2f} MB freed. Retention: {hours}h.'
        ))
