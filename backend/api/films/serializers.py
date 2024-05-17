import re
from rest_framework import serializers, exceptions
from api.films import models


# Create or update film serializer
class FilmSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Film
        fields = ["id", "title", "genre", "description", "director", "release_year", "image_url", "global_rating"]
        extra_kwargs = {
            "global_rating": {"read_only": True}
        }

    def create(self, validated_data):
        return models.Film.objects.create(**validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)


# Create or update  rating serializer
class RatingSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Rating
        fields = ["id", "film", "user", "rating"]

    def create(self, validated_data):
        return models.Rating.objects.create(**validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)