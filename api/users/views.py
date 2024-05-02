from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.db.utils import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from api.users import serializers
from drf_spectacular.utils import extend_schema, OpenApiResponse
from rest_framework.exceptions import AuthenticationFailed


class RegistroView(generics.CreateAPIView):
    serializer_class = serializers.UsuarioSerializer

    def handle_exception(self, exc):
        if isinstance(exc, IntegrityError):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            return super().handle_exception(exc)


class LoginView(generics.CreateAPIView):
    serializer_class = serializers.LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            try:
                usuario = serializer.validated_data
                token, created = Token.objects.get_or_create(user=usuario)
                response = Response({"token": token.key}, status=status.HTTP_200_OK)
                response.set_cookie(
                    key="session",
                    value=token.key,
                    secure=True,
                    httponly=True,
                    samesite="Lax",
                )
                return response
            except ObjectDoesNotExist:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class UsuarioView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.UsuarioSerializer

    def get_object(self):
        cookie = self.request.COOKIES.get("session")

        if cookie:
            try:
                token = Token.objects.get(key=cookie)
                return token.user
            except ObjectDoesNotExist:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(generics.DestroyAPIView):
    def delete(self, request):
        cookie = request.COOKIES.get("session")
        response = Response(status=status.HTTP_204_NO_CONTENT)
        if cookie:
            try:
                token = Token.objects.get(key=cookie)
                token.delete()
                response.delete_cookie("session")
                return response
            except ObjectDoesNotExist:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)
