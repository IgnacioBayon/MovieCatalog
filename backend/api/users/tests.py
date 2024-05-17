from rest_framework.exceptions import ValidationError
# from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from django.test import SimpleTestCase, TestCase
from api.users import serializers

# Global variables for tests to not repeat code
data_register = {
    "nombre": "test",
    "tel": "987654321",
    "email": "test@test.es",
    "password": "Password123",
}
data_login = {
    "email": "test@test.es",
    "password": "Password123",
}

class TestUsuarioSerializer(SimpleTestCase):
    def test_validate_password_valid(self):
        serializer = serializers.UsuarioSerializer()
        password = "Password123"
        self.assertEqual(serializer.validate_password(password), password)

    def test_validate_password_invalid(self):
        serializer = serializers.UsuarioSerializer()
        password_mayus = "password123"
        with self.assertRaises(ValidationError):
            serializer.validate_password(password_mayus)
        password_num = "Password"
        with self.assertRaises(ValidationError):
            serializer.validate_password(password_num)
        password_len = "Pass123"
        with self.assertRaises(ValidationError):
            serializer.validate_password(password_len)


class TestRegistroView(TestCase):
    def test_registro_view(self):
        response = self.client.post("/api/users/", data_register, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["nombre"], data_register["nombre"])
        self.assertEqual(response.data["tel"], data_register["tel"])
        self.assertEqual(response.data["email"], data_register["email"])
        self.assertNotIn("password", response.data)  # Check password is not in response
    
    def test_registro_view_invalid_email(self):
        data = data_register.copy()
        data["email"] = "test"
        response = self.client.post("/api/users/", data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_registro_view_invalid_password(self):
        data = data_register.copy()
        # We just check with one invalid password, as the serializer is tested
        data["password"] = "password"
        response = self.client.post("/api/users/", data, format="json")
        self.assertEqual(response.status_code, 400)

    # We do not check whether the telephone is a number, as there are phone numbers
    # (such as in the US) that contain characters other than numbers.


class TestLoginView(TestCase):
    def test_login_view(self):
        response = self.client.post("/api/users/", data_register, format="json")
        response = self.client.post("/api/users/login/", data_login, format="json")
        self.assertEqual(response.status_code, 200)
    
    def test_login_incorrect_email(self):
        # Recordatorio: ver por que cuando haces logout salta un 401
        data = data_login.copy()
        data["email"] = "incorrectemail@test.com"
        response = self.client.post("/api/users/login/", data, format="json")
        self.assertEqual(response.status_code, 401)
    
    def test_login_incorrect_password(self):
        data = data_login.copy()
        data["password"] = "IncorrectPassword123"
        response = self.client.post("/api/users/login/", data, format="json")
        self.assertEqual(response.status_code, 401)


class TestEditUserView(TestCase):
    def test_edit_user_view(self):
        data = data_register.copy()
        data["nombre"] = "test cambio"
        response = self.client.post("/api/users/", data_register, format="json")
        response = self.client.post("/api/users/login/", data_login, format="json")
        response = self.client.put("/api/users/me/", data, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["nombre"], data["nombre"])
        self.assertEqual(response.data["tel"], data["tel"])
        self.assertEqual(response.data["email"], data["email"])
        self.assertNotIn("password", response.data)  # Check password is not in response
    
    def test_edit_user_view_invalid_email(self):
        data = data_register.copy()
        data["email"] = "test"
        response = self.client.post("/api/users/", data_register, format="json")
        response = self.client.post("/api/users/login/", data_login, format="json")
        response = self.client.put("/api/users/me/", data, content_type="application/json")
        self.assertEqual(response.status_code, 400)

    def test_edit_user_view_invalid_password(self):
        data = data_register.copy()
        data["password"] = "password"
        response = self.client.post("/api/users/", data_register, format="json")
        response = self.client.post("/api/users/login/", data_login, format="json")
        response = self.client.put("/api/users/me/", data, content_type="application/json")
        self.assertEqual(response.status_code, 400)

class TestGetUserView(TestCase):
    def test_get_user_view(self):
        response = self.client.post("/api/users/", data_register, format="json")
        response = self.client.post("/api/users/login/", data_login, format="json")
        response = self.client.get("/api/users/me/")
        self.assertEqual(response.status_code, 200)


class TestLogoutView(TestCase):
    def test_logout_view(self):
        response = self.client.post("/api/users/", data_register, format="json")
        response = self.client.post("/api/users/login/", data_login, format="json")
        response = self.client.delete("/api/users/logout/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class TestDeleteUserView(TestCase):
    def test_delete_user_view(self):
        response = self.client.post("/api/users/", data_register, format="json")
        response = self.client.post("/api/users/login/", data_login, format="json")
        response = self.client.delete("/api/users/me/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
