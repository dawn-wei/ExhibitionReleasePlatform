#coding:utf-8

from django.db.models import Count
from django.shortcuts import render
from django.http import HttpResponse
from .models import Project, Map, MapDetailedPage, Activity, Host, QueryProject, QueryActivity, HotProject, HotActivity
from django.conf import settings
import os
import json
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse


def host_welcome(request):
	return render(request, 'users/host_welcome.html')

def signin(request):
	return render(request, 'users/signin.html')

def signup(request):
	return render(request, 'users/signup.html')

def do_signup(request):
	email = request.POST['email']
	password1 = request.POST['password1']
	password2 = request.POST['password2']

	#email not exists
	hosts = Host.objects.filter(host_email = email)
	if hosts.count() != 0:
		return HttpResponse('account exists')

	#password repeats
	if password1 != password2:
		return HttpResponse('passwords not equal')

	host = Host()
	host.host_email = email
	host.host_password = password1
	host.save()

	request.session['host_online'] = host.id
	ongoing = Project.objects.filter(host = host, project_time1__lte = timezone.now(), project_time2__gte = timezone.now())
	historic = Project.objects.filter(host = host, project_time2__lte = timezone.now())
	waiting = Project.objects.filter(host = host, project_time1__gte = timezone.now())
	return render(request, 'users/index.html', {'host': host, 'ongoing': ongoing, 'historic': historic, 'waiting': waiting})

def signout(request):
	request.session['host_online'] = ''
	return render(request, 'users/signin.html')

def check_signin(request):
	if request.method == 'GET':
		return render(request, 'users/signin.html')
	email = request.POST['email']
	password = request.POST['password']

	hosts = Host.objects.filter(host_email = email)
	if hosts.count() == 0:
		return HttpResponse('not registered!')
	
	for host in hosts:

		if host.host_password == password:
			request.session['host_online'] = host.id

			return index(request)
			'''
			ongoing = Project.objects.filter(host = host, project_time1__lte = timezone.now(), project_time2__gte = timezone.now())
			historic = Project.objects.filter(host = host, project_time2__lte = timezone.now())
			waiting = Project.objects.filter(host = host, project_time1__gte = timezone.now())
			return render(request, 'users/index.html', {'host': host, 'ongoing': ongoing, 'historic': historic, 'waiting': waiting})
			'''
		
		else:
			return render(request, 'users/signin.html')

def index(request):

	# get host_online
	host = Host.objects.get(id = request.session['host_online'])

	# get projects info
	ongoing = Project.objects.filter(host = host, project_time1__lte = timezone.now(), project_time2__gte = timezone.now())
	historic = Project.objects.filter(host = host, project_time2__lte = timezone.now())
	waiting = Project.objects.filter(host = host, project_time1__gte = timezone.now())

	# get hot Projects
	calHotProjects(host)
	hot_projects = getHotProjects(host)
	
	name1 = ''
	name2 = ''
	name3 = ''
	name4 = ''
	i = 1
	for hot in hot_projects:
		if i == 1:
			name1 = hot.project_name
		elif i == 2:
			name2 = hot.project_name
		elif i == 3:
			name3 = hot.project_name
		else:
			name4 = hot.project_name
		i = i + 1

		print(hot.project_name)

	# get hot activities
	calHotActivities(host)
	hot_activities = getHotActivities(host)
	name11 = ''
	name12 = ''
	name13 = ''
	name14 = ''
	i = 1
	for hot in hot_activities:
		if i == 1:
			name11 = hot.activity_name
		elif i == 2:
			name12 = hot.activity_name
		elif i == 3:
			name13 = hot.activity_name
		else:
			name14 = hot.activity_name
		i = i + 1

	return render(request, 'users/index.html', {'host': host, 'ongoing': ongoing, 'historic': historic, 'waiting': waiting, 'hot_projects': hot_projects, 'name1': name1, 'name2': name2, 'name3': name3, 'name4': name4, 'hot_activities': hot_activities, 'name11': name11, 'name12': name12, 'name13':name13, 'name14': name14})

def search(request):
	project_name = request.GET['project_name']
	projects = Project.objects.filter(project_name__contains = project_name)

	host = Host.objects.get(id = request.session['host_online'])

	return render(request, 'users/search_results.html', {'projects': projects, 'host': host})

@csrf_exempt
def set_display_activity(request):

	if request.method == "POST":
		json_receive = json.loads(request.body)
		print(json_receive)
		project_id = json_receive['project_id']

		request.session['project_id'] = project_id
		return HttpResponse(['1'])


def display_activities(request):

	project_id = request.session['project_id']
	project = Project.objects.get(id = project_id)
	activities = Activity.objects.filter(project = project)

	#for activity in activities:
		#map = Map.objects.get(activity = activity)

	return render(request, 'users/display_activities.html', {'activities': activities, 'project': project})

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
	host = Host.objects.get(id = request.session['host_online'])
	return render(request, 'users/new_project.html', {'host': host})

def waiting_projects(request):
	
	host = Host.objects.get(id = request.session['host_online'])

	projects = Project.objects.all().filter(project_time1__gte = timezone.now(), host = host)
	#查看是否已经录入地图
	map_created = []
	for project in projects:
		maps = Map.objects.filter(project = project)
		if maps.count() == 0:
			map_created.append(0)
		else:
			map_created.append(1)

	#print(len(projects))
	return render(request, 'users/waiting_projects.html', {'projects': projects, 'host': host, 'map_created': map_created})

def historic_projects(request):

	host = Host.objects.get(id = request.session['host_online'])
	projects = Project.objects.filter(project_time2__lte = timezone.now(), host = host)

	return render(request, 'users/historic_projects.html', {'projects': projects, 'host': host})

def ongoing_projects(request):
	host = Host.objects.get(id = request.session['host_online'])

	projects = Project.objects.all().filter(project_time1__lte = timezone.now(), project_time2__gte = timezone.now(), host = host)

	return render(request, 'users/ongoing_projects.html', {'projects': projects, 'host': host})

def new_project_submit(request):

	if request.method == 'GET':
		return render(request, 'users/new_project.html')

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
	#project_map = request.FILES.get('project_map')
	project_host = request.POST['project_host']
	project_introduction = request.POST['project_introduction']

	host_id = request.session['host_online']
	host = Host.objects.get(id = host_id)

	# image
	project_image = request.FILES.get('project_image')

	
	if not project_image:
		return HttpResponse('no image uploaded')

	project_image_name = project_image.name
	

	# store file to MEDIA_ROOT
	# store file-path to db
	with open(os.path.join(settings.MEDIA_ROOT, 'image', project_image.name), 'wb+') as dest:
		for chunk in project_image.chunks():
			dest.write(chunk)
		dest.close()


	queryset = Project.objects.filter(project_name = project_name, host = host)
	if queryset.count() > 0:
		return HttpResponse('同名项目已存在')

	Project.objects.create(
		project_type = project_type,
		project_name = project_name,
		project_location = project_location,
		project_time1 = project_time1,
		project_time2 = project_time2,
		#project_map = project_map_name,
		project_host = project_host,
		project_introduction = project_introduction,
		host = host,
		project_image_name = project_image_name,
		created_time = timezone.now()
	)

	
	# set project_id, used for storing map
	project = Project.objects.get(project_name = project_name, host = host)
	project_id = project.id
	request.session['project_id'] = project_id
	
	project_ = Project.objects.get(id = request.session['project_id'])

	return render(request, 'users/add_project_done.html', {'project': project_})


	return index(request)


def map(request):
	return render(request, 'users/map.html')

def new_map(request):
	projects = Project.objects.all()
	host = Host.objects.get(id = request.session['host_online'])
	return render(request, 'users/new_map.html', {'projects': projects, 'host': host})

#最终保存地图到mysql
@csrf_exempt
def save_json(request):
	print('-------------------------')
	if request.method == "POST":
		res = request.POST
		json_receive = json.loads(request.body)
		print("******************************")
		print(json_receive)

		#save json to mysql
		project_id = request.session['project_id']
		project = Project.objects.get(id = project_id)

		# 同一个项目，只能有一个Map
		Map.objects.filter(project = project).delete()
		
		map_save = Map()
		map_save.project = project
		map_save.map_data = json_receive
		map_save.save()

		return HttpResponse(['1'])

@csrf_exempt
def save_json_detailedpage(request):
	res = request.POST
	json_receive = json.loads(request.body)
	print("******************************")
	print(json_receive)

	#save json to mysql
	project_id = request.session['project_id']
	project = Project.objects.get(id = project_id)
	
	map_save = MapDetailedPage()
	map_save.project = project
	map_save.page_name = json_receive['page_name']
	map_save.map_data = json_receive['map_data']
	map_save.save()

	return HttpResponse(['1'])


@csrf_exempt
def set_session(request):
	if request.method == "POST":
		print('----------------set_session----------------')
		#res = request.POST.get("project_id")
		#print(res)
		json_receive = json.loads(request.body)
		print(json_receive)
		project_id = json_receive['project_id']

		request.session['project_id'] = project_id

		return HttpResponse(['1'])


def add_activity(request):
	print (request.session['project_id'])
	project = Project.objects.get(id = request.session['project_id'])
	host = Host.objects.get(id = request.session['host_online'])
	return render(request, 'users/add_activity.html', {'project': project, 'host': host})

@csrf_exempt
def set_project_id(request):

	print('*****************')
	if request.method == "POST":
		json_receive = json.loads(request.body)
		print(json_receive)
		project_id = json_receive['project_id']

		request.session['project_id'] = project_id
		print('-------------new project id----------------')
		return HttpResponse(['1'])

def new_activity_submit(request):
	if request.method == 'GET':
		return render(request, 'users/add_activity.html')

	select = int(request.POST['select'])
	if select == 1:
		activity_type = 'cultural_festival'
	elif select == 2:
		activity_type = 'expo'
	else:
		activity_type = 'graduation_exhibition'

	activity_name = request.POST['activity_name']
	activity_location = request.POST['activity_location']
	activity_time1 = request.POST['activity_time1']
	activity_time2 = request.POST['activity_time2']
	#project_map = request.FILES.get('project_map')
	activity_host = request.POST['activity_host']
	activity_introduction = request.POST['activity_introduction']
	

	# image
	activity_image = request.FILES.get('activity_image')
	
	if not activity_image:
		return HttpResponse('no image uploaded')

	activity_image_name = activity_image.name
	

	# store file to MEDIA_ROOT
	# store file-path to db
	with open(os.path.join(settings.MEDIA_ROOT, 'image', activity_image.name), 'wb+') as dest:
		for chunk in activity_image.chunks():
			dest.write(chunk)
		dest.close()
	
	# activity belongs to Project
	project = Project.objects.get(id = request.session['project_id'])


	if Activity.objects.filter(activity_name = activity_name, project = project).count() > 0:
		return HttpResponse('同名活动已存在')

	Activity.objects.create(
		activity_type = activity_type,
		activity_name = activity_name,
		activity_location = activity_location,
		activity_time1 = activity_time1,
		activity_time2 = activity_time2,
		#project_map = project_map_name,
		activity_host = activity_host,
		activity_introduction = activity_introduction,
		project = project,
		activity_image_name = activity_image_name
	)

	activity = Activity.objects.get(activity_name = activity_name, project = project)

	return render(request, 'users/add_activity_done.html', {'project': project, 'activity': activity})


# 与小程序交互,返回地图
def return_map(request):
	if request.method == "GET":
		project_id = request.GET['project_id']
		map = Map.objects.get(project_id = project_id)

		return HttpResponse(map['map_data'])


def search_activities_miniprogram(request):
	if request.method == "GET":
		query = request.GET['query']
		results = Activity.objects.filter(activity_name__contains = query)

		return HttpResponse(results)


@csrf_exempt
def set_activity_add_map(request):
	if request.method == "POST":
		json_receive = json.loads(request.body)
		print(json_receive)
		activity_id = json_receive['activity_id']

		request.session['activity_add_map'] = activity_id

		return HttpResponse(['1'])


# 小程序查询项目、活动

# 向小程序端返回
def search_project(request):
	if request.method == "GET":
		project_id = request.GET['project_id']
		user_id = request.GET['user_id']

		# add a query item to query_project
		query_project = QueryProject()
		query_project.project_id = project_id
		query_project.user_id = user_id
		query_project.save()

		project = Project.objects.get(id = project_id)
		return HttpResponse(project)

def search_activity(request):
	if request.method == "GET":
		activity_id = request.GET['activity_id']
		user_id = request.GET['user_id']

		# add a query item to query_project
		query_activity = QueryActivity()
		query_activity.activity_id = activity_id
		query_activity.user_id = user_id
		query_activity.save()

		activity = Activity.objects.get(id = activity_id)
		return HttpResponse(activity)


# 注意：以下计算是全局的计算，不特定于某一个host，以下部分本应该放在“平台管理员”模块！！！
'''
按 ‘查询次数’
'''
def calHotProjects(host):
	# return a set of dictionary:[ {'project_id': '1', 'count': 3}, ... ]
	queryset = QueryProject.objects.values('project_id').order_by('project_id').annotate(count=Count('project_id'))
	
	#将每个项目的查询次数计算结果存入table：HotProject
	for item in queryset:
		project_name = Project.objects.get(id = item.project_id).project_name

		hotProject = HotProject()
		hotProject.project_id = item.project_id
		hotProject.project_name = project_name
		hotProject.count = item.count
		hotProject.save()
	
def getHotProjects(host):

	hot_list = []
	queryset = HotProject.objects.all().order_by('-count')
	for hot in queryset:
		# return 4 hots
		if len(hot_list) == 4:
			break

		host_ = Project.objects.get(id = hot.project_id).host
		
		if host.id == host_.id:
			hot_list.append(hot)
	
	'''
	hot_project_names = []
	for hot in hot_list:
		pros = Project.objects.filter(id = hot.project_id)

		#print(pro.project_name)
		#item = {'project_name': pro.project_name, 'count': hot.count}

		#hot.project_id = pro.project_name

		for pro in pros:
			hot_project_names.append(pro)
	'''

	return hot_list


def calHotActivities(host):
	# return a set of dictionary:[ {'activity_id': '1', 'count': 3}, ... ]
	queryset = QueryActivity.objects.values('activity_id').order_by('activity_id').annotate(count=Count('activity_id'))
	
	#将每个项目的查询次数计算结果存入table：HotActivity
	for item in queryset:
		activity_name = Activity.objects.get(id = item.activity_id)

		hotActivity = HotActivity()
		hotActivity.activity_id = item.activity_id
		hotActivity.count = item.count
		hotActivity.activity_name = activity_name
		hotActivity.save()

def getHotActivities(host):

	hot_list = []
	queryset = HotActivity.objects.all().order_by('-count')
	for hot in queryset:
		# return 4 hots
		if len(hot_list) == 4:
			break

		host_ = Activity.objects.get(id = hot.activity_id).project.host

		if host.id == host_.id:
			hot_list.append(hot)
	
	return hot_list


# ajax
@csrf_exempt
def get_project_name(request):
	print('----------------------')

	res = request.GET
	json_receive = json.loads(request.body)

	print(json_receive)

	return HttpResponse(['1'])


# 地图端获取相应项目对应的所有活动
@csrf_exempt
def get_activities(request):
	cur_project_id = request.session['project_id']
	cur_project = Project.objects.get(id = cur_project_id)
	activities = Activity.objects.filter(project = cur_project)

	data = {}
	for acti in activities:
		data[acti.id] = acti.activity_name
		print(acti.id)
		print(acti.activity_name)

	return JsonResponse(data)

@csrf_exempt
def read_json(request):
	cur_project_id = request.session['project_id']
	cur_project = Project.objects.get(id = cur_project_id)

	# only one
	map_data = Map.objects.filter(project = cur_project)

	data = ""
	if map_data.count() == 0:
		data = ""
	else:
		for map in map_data:
			data = str(map.map_data).replace("'", '"')

	print(data)
	return HttpResponse(data)


	'''
	res = {}
	if map_data.count() == 0:
		res['exists'] = 0
		print('0000000000000000000000')
	else:
		res['exists'] = 1
		for map in map_data:
			res['data'] = str(map.map_data).replace("'", '"')

			print(res['data'])
	# many instances
	#detailedpage_data = MapDetailedPage.objects.filter(project = cur_project)

	return HttpResponse(res)
	'''
@csrf_exempt
def set_preview(request):
	json_receive = json.loads(request.body)
	detail_name = json_receive['detail_name']

	request.session['project_id_detail'] = request.session['project_id']
	request.session['detailname'] = detail_name

	return HttpResponse(['1'])


def preview(request):
	#request.session['detailname'] = detailname

	return render(request, 'users/preview.html')

@csrf_exempt
def read_json_detail(request):
	project = Project.objects.get(id = request.session['project_id_detail'])
	page_name = request.session['detailname']

	page = MapDetailedPage.objects.filter(project = project, page_name = page_name)

	data = ""
	if page.count() == 0:
		data = ""
	else:
		map = page[0]
		data = str(map.map_data).replace("'", '"')

	print('------------------详情页-----------------')

	print(data)

	# format may be not right
	return HttpResponse(data)


# 小程序请求详情页
def get_detailed_page(request, projectId, detailedPage):

	request.session['project_id_detail'] = projectId
	request.session['detailname'] = detailedPage

	#page_data = MapDetailedPage.objects.get(project = project, page_name = detailedPage)

	return render(request, 'users/preview.html')