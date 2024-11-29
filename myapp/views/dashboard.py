from django.shortcuts import render
from django.views import View
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
# Create your views here.

class DasboardViews(View):
    @method_decorator(login_required)
    def get(self, request):
        context = {
        'page_title': 'Dashboard'
    }
        return render(request, 'dashboard/index.html', context)