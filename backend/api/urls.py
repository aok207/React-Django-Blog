from django.urls import path
from . import views

urlpatterns = [
    path("users/posts/", views.ListCreatePostView.as_view(), name="user-posts-list"),
    path(
        "users/posts/<int:id>/update/",
        views.UpdatePostView.as_view(),
        name="user-posts-update",
    ),
    path(
        "users/posts/<int:pk>/delete/",
        views.DeletePostView.as_view(),
        name="user-posts-delete",
    ),
    path("posts/", views.ListPostView.as_view(), name="posts-list"),
    path("posts/<int:id>/", views.DetailPostView.as_view(), name="posts-detail"),
]
