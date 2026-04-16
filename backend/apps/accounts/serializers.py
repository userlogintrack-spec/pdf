from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password_confirm')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords don't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        # Create free subscription
        from apps.accounts.models import Subscription
        Subscription.objects.create(user=user, plan=Subscription.Plan.FREE)
        return user


class UserSerializer(serializers.ModelSerializer):
    plan = serializers.CharField(source='subscription.plan', read_only=True, default='free')

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'avatar', 'plan', 'storage_used_bytes', 'date_joined')
        read_only_fields = ('id', 'email', 'storage_used_bytes', 'date_joined')


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value
