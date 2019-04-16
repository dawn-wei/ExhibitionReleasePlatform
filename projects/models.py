#coding:utf-8

from django.db import models

# Create your models here.
class Project(models.Model):
	project_type = models.CharField(max_length = 100, default = '')
	project_name = models.CharField(max_length = 100, default = '')
	project_location = models.CharField(max_length = 100, default = '')
	project_time1 = models.DateTimeField()
	project_time2 = models.DateTimeField()
	project_map = models.CharField(max_length = 100, default = '')
	project_host = models.CharField(max_length = 100, default = '')
	project_introduction = models.CharField(max_length = 1000, default = '')

	def __unicode__(self):
		return self.project_name.encode('utf-8')