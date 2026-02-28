from django.urls import path
from . import views

urlpatterns = [
    path('add', views.add_record, name='add_record'),
    path('show', views.show_records, name='show_records'),
    path('delete/<int:record_id>', views.delete_record),
    path('login', views.admin_login, name='admin_login'),
    path('logout', views.admin_logout, name='admin_logout'),
]