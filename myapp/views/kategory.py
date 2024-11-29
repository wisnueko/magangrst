from django.shortcuts import render, redirect
from django.views import View
from myapp.models import *  
from django.contrib import messages
from django.urls import reverse
from django.db import transaction
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import JsonResponse

class KategoryView(View):
    @method_decorator(login_required)
    def get(self, request):
        # Fetch all categories and departments
        kategory = Kategory.objects.all()
        departements = Departement.objects.all()
        context = {
            'kategory': kategory,  # Use 'kategory' to match the template
            'departements': departements,
            'page_title': 'Kategory',
        }
        return render(request, 'kategori/index.html', context)

    @method_decorator(login_required)
    def post(self, request):
        nama = request.POST.get('nama')
        departement_id = request.POST.get('departement')
        
        try:
            with transaction.atomic():
                # Find the Department by ID
                departement = Departement.objects.get(id=departement_id)
                
                # Create a new Kategory
                tambah_kategory = Kategory(nama=nama, departement=departement)
                tambah_kategory.save()
                
                messages.success(request, "Kategori berhasil ditambah.")
                return redirect(reverse('myapp:kategory'))
        
        except Departement.DoesNotExist:
            messages.error(request, "Departemen tidak ditemukan.")
            return redirect(reverse('myapp:kategory'))
        
        except Exception as e:
            print('Error while adding kategori:', e)
            messages.error(request, "Kategori gagal ditambah.")
            return redirect(reverse('myapp:kategory'))

   

class UpdateKategoryView(View):
    @method_decorator(login_required)
    def post(self, request):
        # Retrieve form data
        kategory_id = request.POST.get('kategory_id')
        nama = request.POST.get('nama')
        department_id = request.POST.get('departement')

        # Validation
        if not kategory_id or not nama or not department_id:
            messages.error(request, "All fields are required.")
            return redirect(reverse('myapp:kategory'))

        try:
            with transaction.atomic():
                # Retrieve the existing Kategory object
                kategory = Kategory.objects.get(id=kategory_id)
                
                # Update fields
                kategory.nama = nama
                kategory.departement = Departement.objects.get(id=department_id)
                kategory.save()

                messages.success(request, f"Kategori '{kategory.nama}' berhasil diupdate.")
        
        except Kategory.DoesNotExist:
            messages.error(request, "Kategori tidak ditemukan.")
        except Departement.DoesNotExist:
            messages.error(request, "Departemen tidak ditemukan.")
        except Exception as e:
            print('Error while updating kategori:', e)
            messages.error(request, "Terjadi kesalahan saat mengupdate kategori.")

        return redirect(reverse('myapp:kategory'))

# View untuk menghapus user
class DeleteKategoryView(View):
    @method_decorator(login_required)
    def post(self, request):
        kategory_id = request.POST.get('kategory_id')  # Retrieve the ID from the form
        
        try:
            with transaction.atomic():
                # Find and delete the Kategory by ID
                kategory = Kategory.objects.get(id=kategory_id)
                kategory.delete()

                messages.success(request, f"Kategori '{kategory.nama}' berhasil dihapus.")
        
        except Kategory.DoesNotExist:
            messages.error(request, "Kategori tidak ditemukan.")
        except Exception as e:
            print('Error while deleting kategori:', e)
            messages.error(request, f"Gagal menghapus kategori: {str(e)}")

        return redirect(reverse('myapp:kategory'))