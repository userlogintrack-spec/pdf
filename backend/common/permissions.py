from rest_framework.permissions import BasePermission


class IsOwnerOrReadOnly(BasePermission):
    """Allow owners to edit, everyone else can only read."""

    def has_object_permission(self, request, view, obj):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False
