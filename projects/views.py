#coding:utf-8

from django.shortcuts import render
from django.http import HttpResponse
from .forms import ProjectForm
from .models import Project
from django.conf import settings
import os
from django.utils import timezone

# Create your views here.
def index(request):
	return render(request, 'users/index.html', {})
'''
def new_project(request):
	if request.method == "POST":
		form = ProjectForm(request.POST)
		if form.is_valid():
			post = form.save()
			return render(request, 'users/index.html', {})

	else:
		form = ProjectForm()
	return render(request, 'users/new_project.html', {'form':form})
'''
def new_project(request):
	return render(request, 'users/new_project.html', {})

def waiting_projects(request):

	projects = Project.objects.all().filter(project_time1__gte = timezone.now())

	#print(len(projects))
	return render(request, 'users/waiting_projects.html', {'projects': projects})

def historic_projects(request):
	return render(request, 'users/historic_projects.html', {})

def ongoing_projects(request):

	projects = Project.objects.all().filter(project_time1__lte = timezone.now(), project_time2__gte = timezone.now())
	return render(request, 'users/ongoing_projects.html', {'projects': projects})

def new_project_submit(request):

	if request.method == 'GET':
		return render(request, 'new_project.html')

	select = int(request.POST['select'])
	if select == 1:
		project_type = 'cultural_festival'
	elif select == 2:
		project_type = 'expo'
	else:
		project_type = 'graduation_exhibition'

	project_name = request.POST['project_name']
	project_location = request.POST['project_location']
	project_time1 = request.POST['project_time1']
	project_time2 = request.POST['project_time2']
	project_map = request.FILES.get('project_map')
	project_host = request.POST['project_host']
	project_introduction = request.POST['project_introduction']

	if not project_map:
		return HttpResponse('no file uploaded')

	project_map_name = project_map.name

	# store file to MEDIA_ROOT
	# store file-path to db
	with open(os.path.join(settings.MEDIA_ROOT, 'uploads', project_map.name), 'wb+') as dest:
		for chunk in project_map.chunks():
			dest.write(chunk)
		dest.close()

	Project.objects.create(
		project_type = project_type,
		project_name = project_name,
		project_location = project_location,
		project_time1 = project_time1,
		project_time2 = project_time2,
		project_map = project_map_name,
		project_host = project_host,
		project_introduction = project_introduction
	)

	return render(request, 'users/index.html', {})