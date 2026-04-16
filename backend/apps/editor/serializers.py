from rest_framework import serializers
from .models import EditSession, EditOperation


class EditOperationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EditOperation
        fields = (
            'id', 'page_number', 'operation_type', 'x', 'y',
            'width', 'height', 'rotation', 'properties', 'z_index',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class EditSessionSerializer(serializers.ModelSerializer):
    operations = EditOperationSerializer(many=True, read_only=True)

    class Meta:
        model = EditSession
        fields = ('id', 'document', 'is_active', 'operations', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
