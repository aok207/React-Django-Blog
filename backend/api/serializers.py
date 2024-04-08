from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Post


class UserSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "password", "password_confirm"]
        extra_kwargs = {
            "password": {"write_only": True},
            "password_confirm": {"write_only": True},
        }

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"],
        )

        user.set_password(validated_data["password"])
        user.save()

        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims to the token
        token["id"] = user.id
        token["username"] = user.username

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["username"] = self.user.get_username()
        data["id"] = self.user.id
        return data


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "description",
            "created_at",
            "author",
            "image",
            "author_name",
        ]
        extra_kwargs = {
            "author": {"read_only": True},
        }

    def get_author_name(self, obj):
        return obj.author.username

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data["author"] = data.pop("author_name")
        return data
