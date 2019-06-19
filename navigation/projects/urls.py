from django.urls import path
from . import views

urlpatterns = [

	path('', views.host_welcome, name = 'host_welcome'),
	path('signin/', views.signin, name ='signin'),
	path('signup/', views.signup, name = 'signup'),
	path('do_signup/', views.do_signup, name = 'do_signup'),
	path('check_signin/', views.check_signin, name = 'check_signin'),
	path('signout/', views.signout, name = 'signout'),
	path('search/', views.search, name = 'search'),

	#查看活动列表
	path('set_display_activity/', views.set_display_activity, name = 'set_display_activity'),
	path('display_activities/', views.display_activities, name = 'display_activities'),

	# 查看map
	path('set_display_map/',  views.set_display_activity, name = 'set_display_map'),

	#path('', views.index, name = 'index'),
	path('index/', views.index, name = 'index'),
	path('new_project/', views.new_project, name = 'new_project'),
	path('waiting_projects', views.waiting_projects, name = 'waiting_projects'),
	path('historic_projects/', views.historic_projects, name = 'historic_projects'),
	path('ongoing_projects/', views.ongoing_projects, name = 'ongoing_projects'),

	path('new_project_submit/', views.new_project_submit, name = 'new_project_submit'),

	path('map.html/', views.map, name = 'mapurl'),

	path('new_map.html/', views.new_map, name = 'new_map'),
	path('set_session/', views.set_session, name = 'set_session'),

	path('save_json/', views.save_json, name = 'save_json'),
	path('save_json_detailedpage/', views.save_json_detailedpage, name = 'save_json_detailedpage'),

	#与小程序从交互
	path('return_map/', views.return_map, name = 'return_map'),

	#添加活动
	path('add_activity/', views.add_activity, name = 'add_activity'),
	path('new_activity_submit/', views.new_activity_submit, name = 'new_activity_submit'),

	#添加地图
	path('set_activity_add_map/', views.set_activity_add_map, name = 'set_activity_add_map'),

	path('set_project_id/', views.set_project_id, name = 'set_project_id'),

	path('get_project_name/', views.get_project_name, name = 'get_project_name'),

	# 地图端获取相应项目对应的所有活动
	path('get_activities/', views.get_activities, name = 'get_activities'),


	# read map from db
	path('read_json/', views.read_json, name = 'read_json'),

	path('set_preview/', views.set_preview, name = 'set_preview'),
	path('preview.html/', views.preview, name = 'preview'),

	path('read_json_detail/', views.read_json_detail, name = 'read_json_detail'),

	path('api/<int:projectId>/<detailedPage>', views.get_detailed_page, name = 'get_detailed_page'),

]