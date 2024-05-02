import re
from rest_framework import serializers, exceptions
from api.films import models


# Create film serializer
class FilmSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Film
        fields = ["title", "genre", "description", "director", "release_date", "rating"]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise exceptions.ValidationError("Rating must be between 1 and 5")
        return value

    def create(self, validated_data):
        return models.Film.objects.create(**validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
