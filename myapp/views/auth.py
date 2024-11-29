from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponseBadRequest
from django.views import View
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.contrib import messages
from django.contrib.auth import login, authenticate, logout
from django.conf import settings
# from support.support_function import truncate, convert_size, get_folder_size
from myapp.models import Master_User as m_user, ROLE_CHOICES
import shutil,os
from django.db import transaction
from django.db.models.functions import TruncMonth
from django.db.models import Sum, Count
from support.support_function import check_is_email
#from support import support_function as sup
#from support.support_function import admin_only
from django.db.models import Q, F



class LoginViews(View):
    def get(self, request):
        # Cek jika user sudah login, langsung redirect ke dashboard
        if request.user.is_authenticated:
            return redirect('myapp:dashboard')

        data = {
            'page_title': 'Login',
        }
        return render(request, 'login/index.html', data)

    def post(self, request):
        # Periksa apakah user sudah login
        if request.user.is_authenticated:
            return redirect('myapp:dashboard')

        # Ambil data email dan password dari form
        email = request.POST.get('email')
        pwd = request.POST.get('password')

        is_email = check_is_email(email)  # Fungsi untuk cek apakah itu email atau username

        # Coba autentikasi berdasarkan email atau username
        if is_email:
            user = authenticate(request, email=email, password=pwd)
        else:
            try:
                user = m_user.objects.get(username=email, is_active=True)
                if not user.check_password(pwd):
                    user = None
            except m_user.DoesNotExist:
                user = None

        # Cek jika user valid
        if user is not None:
            login(request, user)  # Login user
            messages.success(request, f"Selamat datang {user.username} ({user.get_role_display().upper()})")
            
            # Jika ada 'next' parameter, redirect ke sana, jika tidak, redirect ke dashboard
            next_url = request.GET.get('next')
            if next_url:
                return redirect(next_url)
            return redirect('myapp:dashboard')
        else:
            # Jika login gagal
            messages.error(request, "Login gagal, silahkan masukkan data dengan benar")
            return redirect('myapp:login')


@method_decorator(login_required(), name='dispatch')
class LogoutViews(View):
    def get(self, request):
        logout_message = request.GET.get('logout_message', None)
        if logout_message is not None:
            messages.info(request, logout_message)

        # Logout pengguna
        logout(request)

        # Redirect ke halaman yang dituju jika ada, atau ke halaman login jika tidak
        next_url = request.GET.get('next', 'myapp:login')  # Ganti dengan nama URL yang sesuai
        return redirect(next_url)

        