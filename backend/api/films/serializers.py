import re
from rest_framework import serializers, exceptions
from api.films import models


# Create film serializer
class FilmSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Film
        fields = ["title", "genre", "description", "director", "release_year"]

    def create(self, validated_data):
        return models.Film.objects.create(**validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
