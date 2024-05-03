from rest_framework.exceptions import ValidationError
from django.test import SimpleTestCase, TestCase
from api.users import serializers


class TestUsuarioSerializer(SimpleTestCase):
    def test_validate_password_valid(self):
        serializer = serializers.UsuarioSerializer()
        password = "Password123"
        self.assertEqual(serializer.validate_password(password), password)

    def test_validate_password_invalid(self):
        serializer = serializers.UsuarioSerializer()
        # contraseña sin mayusculas
        password_mayus = "password123"
        with self.assertRaises(ValidationError):
            serializer.validate_password(password_mayus)
        # contraseña sin numeros
        password_num = "Password"
        with self.assertRaises(ValidationError):
            serializer.validate_password(password_num)
        # contraseña menor de 8 caracteres
        password_len = "Pass123"
        with self.assertRaises(ValidationError):
            serializer.validate_password(password_len)


class TestRegistroView(TestCase):
    def test_registro_view(self):
        data = {
            "nombre": "test",
            "tel": "987654321",
            "email": "test@test.es",
            "password": "Password123",
        }

        response = self.client.post("/api/users/", data, format="json")
        self.assertEqual(response.status_code, 201)

        # asegurarse de que password no esta en la response
        self.assertNotIn("password", response.data)
