# Generated by Django 4.0.5 on 2023-10-29 06:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clinic', '0025_contract_modified_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='email',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='company',
            name='phone',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='people',
            name='address',
            field=models.TextField(blank=True, null=True),
        ),
    ]