from django.shortcuts import render, redirect
from django.views import View
from myapp.models import Master_User, Departement  # Gunakan Master_User sesuai model
from django.contrib import messages
from django.urls import reverse
from django.db import transaction
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

class UserViews(View):
    @method_decorator(login_required)
    def get(self, request):
        users = Master_User.objects.all()  # Mengambil semua data user dari Master_User
        departements = Departement.objects.all()  # Mengambil semua data departemen
        context = {
            'user': users,
            'departements': departements,
            'page_title': 'User',
        }
        return render(request, 'user/index.html', context)

    # Fungsi untuk menambah user
    @method_decorator(login_required)
    def post(self, request):
        email = request.POST.get('email')
        username = request.POST.get('username')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        phone = request.POST.get('phone')
        department_id = request.POST.get('departement')  # id departemen
        role = request.POST.get('role')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        
        # Validasi: Pastikan password dan confirm_password sama
        if password != confirm_password:
            messages.error(request, "Password dan Confirm Password tidak cocok")
            return redirect(reverse('myapp:user'))
        
        try:
            with transaction.atomic():
                # Ambil objek Departement berdasarkan ID
                department = Departement.objects.get(id=department_id)
                
                # Membuat objek user baru
                tambah_user = Master_User()
                tambah_user.email = email
                tambah_user.username = username
                tambah_user.first_name = first_name
                tambah_user.last_name = last_name
                tambah_user.phone = phone
                tambah_user.departement = department  # Assign objek Departement
                tambah_user.role = role
                tambah_user.set_password(password)  # Mengenkripsi password
                tambah_user.save()
                
                messages.success(request, "User berhasil ditambah")
                return redirect(reverse('myapp:user'))
        except Departement.DoesNotExist:
            messages.error(request, "Departemen tidak ditemukan")
            return redirect(reverse('myapp:user'))
        except Exception as e:
            print('Error while adding user', e)
            messages.error(request, "User gagal ditambah")
            return redirect(reverse('myapp:user'))
                

        

class UpdateUserView(View):
    @method_decorator(login_required)
    def post(self, request):
        user_id = request.POST.get('user_id')
        email = request.POST.get('email')
        username = request.POST.get('username')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        phone = request.POST.get('phone')
        department_id = request.POST.get('departement')
        role = request.POST.get('role')

        try:
            with transaction.atomic():
                # Retrieve and update user data
                user = Master_User.objects.get(user_id=user_id)
                user.email = email
                user.username = username
                user.first_name = first_name
                user.last_name = last_name
                user.phone = phone
                user.departement = Departement.objects.get(id=department_id)
                user.role = role
                user.save()

                messages.success(request, f"User {user.username} berhasil diupdate")
        except Master_User.DoesNotExist:
            messages.error(request, "User tidak ditemukan")
        except Departement.DoesNotExist:
            messages.error(request, "Departemen tidak ditemukan")
        except Exception as e:
            messages.error(request, f"Terjadi kesalahan: {str(e)}")

        return redirect(reverse('myapp:user'))

# View untuk menghapus user
class DeleteUserView(View):
    @method_decorator(login_required)
    def post(self, request):
        user_id = request.POST.get('user_id')
        try:
            with transaction.atomic():
                user = Master_User.objects.get(user_id=user_id)  # Menggunakan Master_User
                user.delete()
                messages.success(request, f"User {user.get_full_name()} berhasil dihapus")
        except Master_User.DoesNotExist:
            messages.error(request, "User tidak ditemukan")
        except Exception as e:
            messages.error(request, f"Gagal menghapus user: {str(e)}")
        return redirect(reverse('myapp:user'))
