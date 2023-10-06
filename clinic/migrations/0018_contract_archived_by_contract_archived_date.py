# Generated by Django 4.0.5 on 2023-10-05 23:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('clinic', '0017_contract_archived'),
    ]

    operations = [
        migrations.AddField(
            model_name='contract',
            name='archived_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='archived_contracts', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='contract',
            name='archived_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]