from django.urls import path
from . import views

urlpatterns = [
    path('sessions/', views.EditSessionCreateView.as_view(), name='session_create'),
    path('sessions/<uuid:id>/', views.EditSessionDetailView.as_view(), name='session_detail'),
    path('sessions/<uuid:session_id>/operations/', views.EditOperationCreateView.as_view(), name='operation_create'),
    path('sessions/<uuid:session_id>/operations/<uuid:op_id>/', views.EditOperationUpdateView.as_view(), name='operation_update'),
    path('sessions/<uuid:session_id>/save/', views.EditSessionSaveView.as_view(), name='session_save'),
    # Existing text editing
    path('text-blocks/<uuid:doc_id>/<int:page_num>/', views.TextBlocksView.as_view(), name='text_blocks'),
    path('text-modify/<uuid:doc_id>/', views.TextModifyView.as_view(), name='text_modify'),
]
