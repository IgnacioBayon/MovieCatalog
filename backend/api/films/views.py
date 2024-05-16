from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.db.utils import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from api.films import serializers
from api.users import serializers as userSerializers


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
        global_rating = self.request.query_params.get('rating', None)

        if title:
            queryset = queryset.filter(title__icontains=title)
        if description:
            queryset = queryset.filter(description__icontains=description)
        if genre:
            queryset = queryset.filter(genre__icontains=genre)
        print(f"Global Rating {global_rating}")
        if global_rating:
            queryset = queryset.filter(global_rating__gte=global_rating)
        
        return queryset
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


# I want to have a view for the rating. I want to be able to create a rating or update it if it already exists
class RatingView(generics.CreateAPIView):
    serializer_class = serializers.RatingSerializer
    
    def handle_exception(self, exc):
        if isinstance(exc, IntegrityError):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            return super().handle_exception(exc)
        
    def post(self, request, *args, **kwargs):
        film_id = request.data.get('film', None)
        user_id = request.data.get('user', None)
        rating_value = request.data.get('rating', None)

        if not film_id or not user_id or not rating_value:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        try:
            film = serializers.FilmSerializer.Meta.model.objects.get(id=film_id)
            user = userSerializers.UsuarioSerializer.Meta.model.objects.get(id=user_id)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        try:
            rating = serializers.RatingSerializer.Meta.model.objects.get(film=film, user=user)
            rating.rating = rating_value
            rating.save()
        except ObjectDoesNotExist:
            rating = serializers.RatingSerializer.Meta.model.objects.create(film=film, user=user, rating=rating_value)  
            rating.save()
        
        return Response(status=status.HTTP_201_CREATED)



class RatingsView(generics.ListAPIView):
    serializer_class = serializers.RatingSerializer
    queryset = serializers.RatingSerializer.Meta.model.objects.all()

    def handle_exception(self, exc):
        return super().handle_exception(exc)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        film = self.request.query_params.get('film', None)
        user = self.request.query_params.get('user', None)
        rating = self.request.query_params.get('rating', None)

        if film:
            queryset = queryset.filter(film__title__icontains=film)
        if user:
            queryset = queryset.filter(user__username__icontains=user)
        if rating:
            queryset = queryset.filter(rating__gte=rating)
        
        return queryset
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)