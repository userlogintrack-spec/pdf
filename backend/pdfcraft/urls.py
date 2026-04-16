from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/documents/', include('apps.documents.urls')),
    path('api/v1/editor/', include('apps.editor.urls')),
    path('api/v1/tools/', include('apps.tools.urls')),
    path('api/v1/convert/', include('apps.conversions.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
