# Generated by Django 4.0.5 on 2023-12-05 03:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clinic', '0026_company_email_company_phone_people_address'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='management_right_level',
            field=models.IntegerField(blank=True, choices=[(0, 'Guest'), (1, 'Low'), (2, 'Middle'), (3, 'Top')], null=True),
        ),
        migrations.DeleteModel(
            name='ContractPrice',
        ),
    ]
