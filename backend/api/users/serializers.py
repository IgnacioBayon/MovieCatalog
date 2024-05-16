import re
from rest_framework import serializers, exceptions
from django.contrib.auth import authenticate
from api.users import models


class UsuarioSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Usuario
        fields = ["id", "nombre", "tel", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True},
            "id": {"read_only": True},
        }

    def validate_password(self, value):
        valid_password = True
        # check this pattern: ^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$
        if not re.match(r"^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$", value):
            valid_password = False
        if len(value) < 8:
            valid_password = False

        if valid_password:
            return value
        else:
            raise exceptions.ValidationError("Invalid password format")

    def create(self, validated_data):
        return models.Usuario.objects.create_user(
            username=validated_data["email"], **validated_data
        )

    def update(self, instance, validated_data):
        if validated_data.get("password"):
            instance.set_password(validated_data.pop("password"))
        return super().update(instance, validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data["email"], password=data["password"])

        if user:
            return user
        else:
            raise exceptions.AuthenticationFailed("Invalid credentials")
