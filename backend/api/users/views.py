from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import NotFound
from django.db.utils import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from api.users import serializers
from drf_spectacular.utils import extend_schema, OpenApiResponse
from rest_framework.exceptions import AuthenticationFailed
from django.utils import timezone
from datetime import timedelta


class RegistroView(generics.CreateAPIView):
    serializer_class = serializers.UsuarioSerializer

    def handle_exception(self, exc):
        if isinstance(exc, IntegrityError):

            return Response(status=status.HTTP_409_CONFLICT)
        else:
            return super().handle_exception(exc)


class LoginView(generics.CreateAPIView):
    serializer_class = serializers.LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        try:
            if serializer.is_valid():
                user = serializer.validated_data
                token, created = Token.objects.get_or_create(user=user)
                response = Response({'token': token.key},
                                    status=status.HTTP_200_OK)
                if created:
                    # Permanent cookie
                    expires_at = timezone.now() + timedelta(days=14)
                    response.set_cookie(
                        key='session',
                        value=token.key,
                        secure=True,
                        httponly=False,
                        samesite='None',
                        expires=expires_at
                    )
                return response
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        except AuthenticationFailed:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class UsuarioView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.UsuarioSerializer

    def get_object(self):
        token_key = self.request.COOKIES.get('session')
        try:
            token = Token.objects.get(key=token_key)
        except Token.DoesNotExist:
            raise ObjectDoesNotExist
        return token.user

    def handle_exception(self, exc):
        if isinstance(exc, ObjectDoesNotExist):
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return super().handle_exception(exc)


@extend_schema(
    description='Logout endpoint',
    responses={
        204: OpenApiResponse(description='Logout successful'),
        401: OpenApiResponse(description='Invalid session')
    }
)
class LogoutView(generics.DestroyAPIView):
    def delete(self, request):
        token_key = request.COOKIES.get('session')
        try:
            token = Token.objects.get(key=token_key)
            token.delete()
            response = Response(status=status.HTTP_204_NO_CONTENT)
            response.delete_cookie('session')
        except Token.DoesNotExist:
            raise ObjectDoesNotExist
        return response

    def handle_exception(self, exc):
        if isinstance(exc, ObjectDoesNotExist):
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return super().handle_exception(exc)
