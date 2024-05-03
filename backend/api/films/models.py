from django.db import models
from api.users.models import Usuario


# Create your models here.
# Create Film model
class Film(models.Model):
    title = models.CharField(max_length=256)
    genre = models.CharField(max_length=64)
    description = models.TextField()
    director = models.CharField(max_length=128)
    release_year = models.IntegerField()
    global_rating = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.title

    def get_rating(self):
        # I want to get the average rating of the film
        ratings = Rating.objects.filter(film=self)
        if ratings.count() == 0:
            return 0
        else:
            return sum([r.rating for r in ratings]) / ratings.count()
    
    def save(self, *args, **kwargs):
        self.global_rating = self.get_rating()
        super().save(*args, **kwargs)


class Rating(models.Model):
    film = models.ForeignKey(Film, on_delete=models.CASCADE)
    user = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    rating = models.IntegerField()

    def __str__(self):
        return f"{self.film.title} - {self.user.username} - {self.rating}"
