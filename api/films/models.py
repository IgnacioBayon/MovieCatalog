from django.db import models


# Create your models here.
# Create Film model
class Film(models.Model):
    title = models.CharField(max_length=256)
    genre = models.CharField(max_length=64)
    description = models.TextField()
    director = models.CharField(max_length=128)
    release_date = models.DateField()
    rating = models.IntegerField()

    def __str__(self):
        return self.title
