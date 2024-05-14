from django.contrib import admin
from django.urls import path
from .users import views
from .films import views as viewsFilms
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/users/", views.RegistroView.as_view(), name="registro"),
    path("api/users/login/", views.LoginView.as_view(), name="login"),
    path("api/users/me/", views.UsuarioView.as_view(), name="usuario"),
    path("api/users/logout/", views.LogoutView.as_view(), name="logout"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
    path("api/films/", viewsFilms.CreateFilmView.as_view(), name="create_film"),
    # Create a path for a single film with the title as the primary key
    path("api/films/<str:pk>", viewsFilms.FilmView.as_view(), name="film"),
    path("api/films/edit/<str:pk>", viewsFilms.EditFilmView.as_view(), name="film"),
    # Create a path for all the films
    path("api/films/all/", viewsFilms.FilmsView.as_view(), name="films"),
]
