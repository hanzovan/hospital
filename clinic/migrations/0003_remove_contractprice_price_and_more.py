# Generated by Django 4.0.5 on 2023-08-19 15:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clinic', '0002_client_contract_people_service_quotation_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='contractprice',
            name='price',
        ),
        migrations.RemoveField(
            model_name='quotation',
            name='quote_price',
        ),
        migrations.RemoveField(
            model_name='service',
            name='price',
        ),
        migrations.AddField(
            model_name='contractprice',
            name='female_price',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='contractprice',
            name='male_price',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='quotation',
            name='female_quote_price',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='quotation',
            name='male_quote_price',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='service',
            name='female_price',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='service',
            name='male_price',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
