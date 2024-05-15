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

class EditFilmView(generics.UpdateAPIView):
    # Create a view to edit the film fields using patch
    # When I go to edit the film, I want the fields to be written already
    # so I can edit them and not have to write them again
    serializer_class = serializers.FilmSerializer
    queryset = serializers.FilmSerializer.Meta.model.objects.all()

    def handle_exception(self, exc):
        if isinstance(exc, ObjectDoesNotExist):
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return super().handle_exception(exc)
        
    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class FilmsView(generics.ListAPIView):
    serializer_class = serializers.FilmSerializer
    queryset = serializers.FilmSerializer.Meta.model.objects.all()

    def handle_exception(self, exc):
        return super().handle_exception(exc)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        title = self.request.query_params.get('title', None)
        description = self.request.query_params.get('description', None)
        genre = self.request.query_params.get('genre', None)
        # rating = self.request.query_params.get('rating', None)

        if title:
            queryset = queryset.filter(title__icontains=title)
        if description:
            queryset = queryset.filter(description__icontains=description)
        if genre:
            queryset = queryset.filter(genre__icontains=genre)
        # if rating:
        #     queryset = queryset.filter(rating >= rating)
        
        return queryset
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
