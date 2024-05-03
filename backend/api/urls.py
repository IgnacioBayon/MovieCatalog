from django.contrib import admin
from django.urls import path
from .users import views
from .films import views as viewsFilms
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView


urlpatterns = [
    path("api/users/", views.RegistroView.as_view(), name="registro"),
    path("api/users/login/", views.LoginView.as_view(), name="login"),
    path("api/users/me/", views.UsuarioView.as_view(), name="usuario"),
    path("api/users/logout/", views.LogoutView.as_view(), name="logout"),
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
    path("api/films/", viewsFilms.CreateFilmView.as_view(), name="create_film"),
    path("api/films/<int:pk>/", viewsFilms.FilmView.as_view(), name="film"),
]
