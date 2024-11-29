from django.shortcuts import render, redirect
from django.views import View
from myapp.models import *
from django.contrib import messages
from django.urls import reverse
from django.db import transaction
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
#from myapp.decorators import role_required, is_verified

# View only accessible by superadmin

class DepartementViews(View):
    @method_decorator(login_required)
    def get(self, request):
        departements = Departement.objects.all()  # Mengambil semua data departemen
        context = {
            'departements': departements,
            'page_title': 'Departement',
        }
        return render(request, 'departement/index.html', context)

    # Fungsi untuk menambah departemen
    @method_decorator(login_required)
    def post(self, request):
        departement_name = request.POST.get('department_name')  # Perbaiki key di sini
        if departement_name:
            try:
                with transaction.atomic():
                    new_departement = Departement(nama=departement_name)
                    new_departement.save()
                    messages.success(request, f"Department {departement_name} berhasil ditambahkan")
            except Exception as e:
                messages.error(request, f"Gagal menambahkan departemen: {str(e)}")
        return redirect(reverse('myapp:departement'))

# View untuk mengupdate departemen

class UpdateDepartementView(View):
    @method_decorator(login_required)
    def post(self, request):
        departement_id = request.POST.get('department_id')
        departement_nama = request.POST.get('department_name')
        
        try:
            with transaction.atomic():
                departement = Departement.objects.get(id=departement_id)
                departement.nama = departement_nama
                departement.save()
                
                messages.success(request, f"Department {departement_nama} berhasil diupdate")
        except Departement.DoesNotExist:
            messages.error(request, "Department tidak ditemukan")
        except Exception as e:
            messages.error(request, f"Terjadi kesalahan: {str(e)}")
        
        return redirect(reverse('myapp:departement'))

# View untuk menghapus departemen

class DeleteDepartementView(View):
    @method_decorator(login_required)
    def post(self, request):
        if 'delete_all' in request.POST:  # Check for the delete_all flag
            try:
                Departement.objects.all().delete()  # Delete all departments
                messages.success(request, "All departments have been deleted successfully.")
            except Exception as e:
                messages.error(request, f"Error deleting departments: {str(e)}")
        else:
            departement_id = request.POST.get('departement_id')
            try:
                departement = Departement.objects.get(id=departement_id)
                departement.delete()
                messages.success(request, f"Department {departement.nama} has been deleted successfully.")
            except Departement.DoesNotExist:
                messages.error(request, "Department not found.")
            except Exception as e:
                messages.error(request, f"Error deleting department: {str(e)}")

        return redirect('myapp:departement')  # Redirect after deletion