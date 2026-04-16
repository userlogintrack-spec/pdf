import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    storage_used_bytes = models.BigIntegerField(default=0)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


class Subscription(models.Model):
    class Plan(models.TextChoices):
        FREE = 'free', 'Free'
        BASIC = 'basic', 'Basic'
        PROFESSIONAL = 'pro', 'Professional'
        ENTERPRISE = 'enterprise', 'Enterprise'

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription')
    plan = models.CharField(max_length=20, choices=Plan.choices, default=Plan.FREE)
    stripe_customer_id = models.CharField(max_length=255, blank=True)
    stripe_subscription_id = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    current_period_start = models.DateTimeField(null=True, blank=True)
    current_period_end = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.plan}"


class UsageQuota(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='usage')
    date = models.DateField()
    documents_processed = models.IntegerField(default=0)
    pages_processed = models.IntegerField(default=0)
    ocr_pages = models.IntegerField(default=0)
    conversions = models.IntegerField(default=0)

    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.email} - {self.date}"
