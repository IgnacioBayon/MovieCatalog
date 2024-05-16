from django.test import TestCase
from api.films import serializers
from api.users import serializers as user_serializers
from rest_framework.exceptions import ValidationError


data_film = {
    "title": "test",
    "genre": "test",
    "description": "test",
    "director": "test",
    "release_year": 2021,
    "image_url": "http://test.com",
}
data_rating = {
    "film": 1,
    "user": 1,
    "rating": 5,
}
data_register = {
    "nombre": "test",
    "tel": "987654321",
    "email": "test@test.es",
    "password": "Password123",
}


class TestCreateFilm(TestCase):
    def test_create_film(self):
        response = self.client.post("/api/films/", data_film, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["title"], data_film["title"])
        self.assertEqual(response.data["genre"], data_film["genre"])
        self.assertEqual(response.data["description"], data_film["description"])
        self.assertEqual(response.data["director"], data_film["director"])
        self.assertEqual(response.data["release_year"], data_film["release_year"])
        self.assertEqual(response.data["image_url"], data_film["image_url"])


class TestGetFilm(TestCase):
    def test_get_film(self):
        response = self.client.post("/api/films/", data_film, format="json")
        response = self.client.get(f"/api/films/1/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], data_film["title"])
        self.assertEqual(response.data["genre"], data_film["genre"])
        self.assertEqual(response.data["description"], data_film["description"])
        self.assertEqual(response.data["director"], data_film["director"])
        self.assertEqual(response.data["release_year"], data_film["release_year"])
        self.assertEqual(response.data["image_url"], data_film["image_url"])


class TestEditFilm(TestCase):
    def test_edit_film(self):
        response = self.client.post("/api/films/", data_film, format="json")
        data_film["title"] = "test edited"
        response = self.client.put("/api/films/1/", data_film, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], data_film["title"])
        self.assertEqual(response.data["genre"], data_film["genre"])
        self.assertEqual(response.data["description"], data_film["description"])
        self.assertEqual(response.data["director"], data_film["director"])
        self.assertEqual(response.data["release_year"], data_film["release_year"])
        self.assertEqual(response.data["image_url"], data_film["image_url"])


class TestDeleteFilm(TestCase):
    def test_delete_film(self):
        response = self.client.post("/api/films/", data_film, format="json")
        response = self.client.delete("/api/films/1/", content_type="application/json")
        self.assertEqual(response.status_code, 204)


class TestCreateRating(TestCase):
    def test_create_rating(self):
        response = self.client.post("/api/users/", data_register, format="json")
        response = self.client.post("/api/films/", data_film, format="json")
        response = self.client.post("/api/films/ratings/", data_rating, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["film"], data_rating["film"])
        self.assertEqual(response.data["user"], data_rating["user"])

    # No need to create test_create_rating_invalid as in the web, there are
    # only buttons to rate the film, so the rating will always be between 1 and 5.


class TestEditRating(TestCase):
    def test_edit_rating(self):
        response = self.client.post("/api/users/", data_register, format="json")
        response = self.client.post("/api/films/", data_film, format="json")
        response = self.client.post("/api/films/ratings/", data_rating, format="json")
        data_rating["rating"] = 2
        response = self.client.post("/api/films/ratings/", data_rating, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["rating"], data_rating["rating"])
        # Check that there is only one rating for the film and user
        response = self.client.get("/api/films/ratings/", data_rating, format="json")
        self.assertEqual(len(response.data), 1)
