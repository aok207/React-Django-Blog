from django.shortcuts import get_object_or_404, render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, CustomTokenObtainPairSerializer, PostSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Post
from rest_framework_simplejwt.views import TokenObtainPairView


# Create your views here.
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class ListCreatePostView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(author=user).order_by("-created_at")

    def perform_create(self, serializer):
        if serializer.is_valid():
            print(self.request.user)
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class ListPostView(generics.ListAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.order_by("-created_at").all()


class DetailPostView(generics.RetrieveAPIView):
    serializer_class = PostSerializer

    def get_object(self):
        return get_object_or_404(Post, id=self.kwargs["id"])


class UpdatePostView(generics.RetrieveUpdateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def get_object(self):
        user = self.request.user
        return get_object_or_404(Post, id=self.kwargs["id"], author=user)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class DeletePostView(generics.DestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def get_object(self):
        user = self.request.user
        return get_object_or_404(Post, id=self.kwargs["pk"], author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
