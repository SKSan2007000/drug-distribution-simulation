from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('simulation/', views.simulation, name='simulation'),
    path('methodology/', views.methodology, name='methodology'),
    path('report/', views.report, name='report'),
]
