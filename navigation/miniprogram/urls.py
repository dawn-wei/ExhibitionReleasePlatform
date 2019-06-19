from django.urls import path
from . import views

urlpatterns = [
	path('api/get_all_cultures', views.getAllCultures, name='getAllCultures'),					#查询所有书籍
	path('api/get_all_exhibitions', views.getAllExhibitions, name='getAllExhibitions'),					#查询所有书籍
	path('api/get_all_graduations', views.getAllGraduations, name='getAllGraduations'),					#查询所有书籍


	path('api/get_you_like', views.getYouLike, name='getYouLike'),						#猜你喜欢
	path('api/get_hot_recommend', views.getHotRecommend, name='getHotRecommend'),		#热门推荐
	path('api/get_chapter', views.getChapter, name='getChapter'),						#小说章节
	path('api/get_chapter_detail', views.getChapterDetail, name='getChapterDetail'),	#小说章节详情
	path('api/get_abstract', views.getAbstract, name='getAbstract'),					#小说简介
	path('api/get_banner_one', views.getBannerOne, name='getBannerOne'),				#首页banner推荐

    path('api/get_search', views.get_search, name = 'get_search'),

	path('api/get_newests', views.get_newests, name = 'get_newests'),

	#path('api/get_detailed_page',views.get_detailed_page, name = 'get_detailed_page' ),

	path('api/get_map', views.get_map, name = 'get_map'),

	path('api/get_acti_list/<int:project_id>', views.get_acti_list, name = 'get_acti_list'),
]