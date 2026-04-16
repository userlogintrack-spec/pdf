from django.urls import path
from . import views

urlpatterns = [
    path('merge/', views.MergeView.as_view(), name='merge'),
    path('split/', views.SplitView.as_view(), name='split'),
    path('rotate/', views.RotateView.as_view(), name='rotate'),
    path('reorder/', views.ReorderView.as_view(), name='reorder'),
    path('extract/', views.ExtractView.as_view(), name='extract'),
    path('compress/', views.CompressView.as_view(), name='compress'),
    path('watermark/', views.WatermarkView.as_view(), name='watermark'),
    path('crop/', views.CropView.as_view(), name='crop'),
    path('jobs/<uuid:job_id>/', views.JobStatusView.as_view(), name='job_status'),
]
