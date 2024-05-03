from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.db.utils import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from api.films import serializers


# Create your views here.
class CreateFilmView(generics.CreateAPIView):
    serializer_class = serializers.FilmSerializer

    def handle_exception(self, exc):
        if isinstance(exc, IntegrityError):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            return super().handle_exception(exc)


class FilmView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.FilmSerializer
    queryset = serializers.FilmSerializer.Meta.model.objects.all()

    def handle_exception(self, exc):
        if isinstance(exc, ObjectDoesNotExist):
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return super().handle_exception(exc)
