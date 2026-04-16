import os
from pathlib import Path

from celery import Celery
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / '.env')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pdfcraft.settings.development')

app = Celery('pdfcraft')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
