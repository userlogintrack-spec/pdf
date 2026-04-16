from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.DocumentUploadView.as_view(), name='document_upload'),
    path('', views.DocumentListView.as_view(), name='document_list'),
    path('<uuid:id>/', views.DocumentDetailView.as_view(), name='document_detail'),
    path('<uuid:doc_id>/pages/<int:page_num>/image/', views.PageImageView.as_view(), name='page_image'),
    path('<uuid:doc_id>/pages/<int:page_num>/text/', views.PageTextView.as_view(), name='page_text'),
    path('<uuid:doc_id>/thumbnail/<int:page_num>/', views.ThumbnailView.as_view(), name='thumbnail'),
    path('<uuid:doc_id>/assets/', views.DocumentAssetUploadView.as_view(), name='asset_upload'),
]
