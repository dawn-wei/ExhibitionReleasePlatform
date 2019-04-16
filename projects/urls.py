from django.urls import path
from . import views

urlpatterns = [
	path('', views.index, name = 'index'),
	path('new_project/', views.new_project, name = 'new_project'),
	path('waiting_projects', views.waiting_projects, name = 'waiting_projects'),
	path('historic_projects/', views.historic_projects, name = 'historic_projects'),
	path('ongoing_projects/', views.ongoing_projects, name = 'ongoing_projects'),

	path('new_project_submit/', views.new_project_submit, name = 'new_project_submit'),
]