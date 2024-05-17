from django.contrib import admin
from .models import Film, Rating
from ..users.models import Usuario


class FilmAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser
    
admin.site.register(Film, FilmAdmin)
