import re
from rest_framework import serializers, exceptions
from api.films import models


# Create film serializer
class FilmSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Film
        fields = ["id", "title", "genre", "description", "director", "release_year", "image_url", "global_rating"]

    def create(self, validated_data):
        return models.Film.objects.create(**validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
