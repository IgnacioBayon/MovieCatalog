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
        
    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)  

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)   


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
        skip = self.request.query_params.get('skip', None)
        limit = self.request.query_params.get('limit', None)

        if title:
            queryset = queryset.filter(title__icontains=title)
        if description:
            queryset = queryset.filter(description__icontains=description)
        if genre:
            queryset = queryset.filter(genre__icontains=genre)
        if global_rating:
            queryset = queryset.filter(global_rating__gte=global_rating)
        if skip:
            queryset = queryset[int(skip):]
        if limit:
            queryset = queryset[:int(limit)]
        
        return queryset
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class CreateRatingView(generics.CreateAPIView):
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
            # Print all the films and users
            film = serializers.FilmSerializer.Meta.model.objects.get(id=film_id)
            user = userSerializers.UsuarioSerializer.Meta.model.objects.get(id=user_id)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        try:
            rating = serializers.RatingSerializer.Meta.model.objects.get(film=film, user=user)
            rating.rating = rating_value
            rating.save()
            status_code = status.HTTP_200_OK
        except ObjectDoesNotExist:
            rating = serializers.RatingSerializer.Meta.model.objects.create(film=film, user=user, rating=rating_value)  
            rating.save()
            status_code = status.HTTP_201_CREATED        
        
        return Response(status=status_code, data=serializers.RatingSerializer(rating).data)


class RatingView(generics.RetrieveAPIView):
    serializer_class = serializers.RatingSerializer
    queryset = serializers.RatingSerializer.Meta.model.objects.all()

    def handle_exception(self, exc):
        if isinstance(exc, ObjectDoesNotExist):
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return super().handle_exception(exc)


class RatingsView(generics.ListAPIView):
    serializer_class = serializers.RatingSerializer
    queryset = serializers.RatingSerializer.Meta.model.objects.all()

    def handle_exception(self, exc):
        return super().handle_exception(exc)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        film = self.request.query_params.get('film', None)
        user = self.request.query_params.get('user', None)

        if film:
            queryset = queryset.filter(film=film)
        if user:
            queryset = queryset.filter(user=user)
        
        return queryset
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)