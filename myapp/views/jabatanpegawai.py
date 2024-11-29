from django.shortcuts import render, redirect
from django.views import View
from myapp.models import *
from django.contrib import messages
from django.urls import reverse
from django.db import transaction
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator


# View for managing positions (Jabatan)
class JabatanView(View):
    @method_decorator(login_required)
    def get(self, request):
        jabatan = Jabatan.objects.all()  # Retrieve all jabatan
        context = {
            'jabatan': jabatan,
            'page_title': 'Manage Positions',  # Title for the page
        }
        return render(request, 'jabatan/index.html', context)

    # Function to add a new position
    @method_decorator(login_required)
    def post(self, request):
        jabatan_name = request.POST.get('jabatan_name')  # Get the name of the position
        if jabatan_name:
            try:
                with transaction.atomic():
                    new_jabatan = Jabatan(nama=jabatan_name)
                    new_jabatan.save()
                    messages.success(request, f"Position {jabatan_name} successfully added.")
            except Exception as e:
                messages.error(request, f"Failed to add position: {str(e)}")
        return redirect(reverse('myapp:jabatan'))  # Redirect to the same page after adding

# View to update a position
class UpdateJabatanView(View):
    @method_decorator(login_required)
    def post(self, request):
        jabatan_id = request.POST.get('jabatan_id')  # Get the jabatan ID
        jabatan_nama = request.POST.get('jabatan_name')  # Get the new jabatan name
        
        try:
            with transaction.atomic():
                jabatan = Jabatan.objects.get(id=jabatan_id)  # Find the jabatan by ID
                jabatan.nama = jabatan_nama  # Update the name of the jabatan
                jabatan.save()
                
            messages.success(request, f"Jabatan {jabatan_nama} berhasil diupdate.")
        except Jabatan.DoesNotExist:
            messages.error(request, "Jabatan tidak ditemukan")
        except Exception as e:
            messages.error(request, f"Terjadi kesalahan: {str(e)}")
        
        return redirect(reverse('myapp:jabatan'))  # Redirect after updating

# View to delete a position
class DeleteJabatanView(View):
    @method_decorator(login_required)
    def post(self, request):
        if 'delete_all' in request.POST:  # Check if delete_all flag is set
            try:
                Jabatan.objects.all().delete()  # Delete all jabatan records
                messages.success(request, "All positions have been deleted successfully.")
            except Exception as e:
                messages.error(request, f"Failed to delete positions: {str(e)}")
        else:
            jabatan_id = request.POST.get('jabatan_id')  # Get the jabatan ID to delete
            try:
                jabatan = Jabatan.objects.get(id=jabatan_id)
                jabatan.delete()
                messages.success(request, f"Position {jabatan.nama} successfully deleted.")
            except Jabatan.DoesNotExist:
                messages.error(request, "Position not found.")
            except Exception as e:
                messages.error(request, f"Failed to delete position: {str(e)}")
        
        return redirect('myapp:jabatan')  # Redirect after deleting
