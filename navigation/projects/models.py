#coding:utf-8

from django.db import models
import jsonfield
from django.utils import timezone
# Create your models here.

class Host(models.Model):
	host_email = models.EmailField(default = '')
	host_password = models.CharField(max_length = 100, default = '')
	host_name = models.CharField(max_length = 100, default = '')
	host_address = models.CharField(max_length = 100, default = '')
	host_introduction = models.CharField(max_length = 1000, default = '')

	def __unicode__(self):
		return self.host_name.encode('utf-8')


class Project(models.Model):
	project_type = models.CharField(max_length = 100, default = '')
	project_name = models.CharField(max_length = 100, default = '')
	project_location = models.CharField(max_length = 100, default = '')
	project_time1 = models.DateTimeField()
	project_time2 = models.DateTimeField()
	#project_map = models.CharField(max_length = 100, default = '')
	project_host = models.CharField(max_length = 100, default = '')
	project_introduction = models.CharField(max_length = 1000, default = '')
	host = models.ForeignKey(Host, verbose_name = "host", on_delete = models.CASCADE)
	project_image_name = models.CharField(max_length = 100, default = '')
	created_time = models.DateTimeField()

	def __unicode__(self):
		return self.project_name.encode('utf-8')

class Activity(models.Model):
	activity_type = models.CharField(max_length = 100, default = '')
	activity_name = models.CharField(max_length = 100, default = '')
	activity_location = models.CharField(max_length = 100, default = '')
	activity_time1 = models.DateTimeField()
	activity_time2 = models.DateTimeField()
	#project_map = models.CharField(max_length = 100, default = '')
	activity_host = models.CharField(max_length = 100, default = '')
	activity_introduction = models.CharField(max_length = 1000, default = '')
	activity_image_name = models.CharField(max_length = 100, default = '')


	project = models.ForeignKey(Project, verbose_name = "project", on_delete = models.CASCADE)

# 默认地图
class Map(models.Model):
	project = models.ForeignKey(Project, verbose_name = "project", on_delete=models.CASCADE, default = '')
	map_data = jsonfield.JSONField()

class MapPoint(models.Model):
	activity = models.ForeignKey(Activity, verbose_name = "activity", on_delete=models.CASCADE)

	floor = models.CharField(max_length = 100, default = '1')
	map_data = jsonfield.JSONField()

class MapDetailPage(models.Model):
	mapPoint = models.ForeignKey(MapPoint, verbose_name = "mappoint", on_delete = models.CASCADE)

	detailpage_name = models.CharField(max_length = 100, default = '')
	map_data = jsonfield.JSONField()

# 详情页
class MapDetailedPage(models.Model):
	project = models.ForeignKey(Project, verbose_name = "project", on_delete=models.CASCADE, default = '')
	page_name = models.CharField(max_length = 100, default = '')
	map_data = jsonfield.JSONField()

class QueryProject(models.Model):
	project_id = models.CharField(max_length = 100, default = '')
	user_id = models.CharField(max_length = 100, default = '')

class HotProject(models.Model):
	project_id = models.CharField(max_length = 100, default = '')
	project_name = models.CharField(max_length = 100, default = '')
	count = models.IntegerField(default = 0)

class QueryActivity(models.Model):
	activity_id = models.CharField(max_length = 100, default = '')
	user_id = models.CharField(max_length = 100, default = '')

class HotActivity(models.Model):
	activity_id = models.CharField(max_length = 100, default = '')
	activity_name = models.CharField(max_length = 100, default = '')
	count = models.IntegerField(default = 0)

class Comment(models.Model):
	pass

class Tourist(models.Model):
	pass