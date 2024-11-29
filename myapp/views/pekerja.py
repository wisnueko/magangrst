from django.shortcuts import render, redirect
from django.views import View
from myapp.models import *  
from django.contrib import messages
from django.urls import reverse
from django.db import transaction
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import JsonResponse


from django.shortcuts import get_object_or_404
from django.db import IntegrityError

class PekerjaView(View):
    @method_decorator(login_required)
    def get(self, request):
        # Fetch all pegawai
        pegawai = Pegawai.objects.all()
        jabatan = Jabatan.objects.all()  # Fetch Jabatan objects
        
        context = {
            'pegawai': pegawai,
            'jabatan': jabatan,
            'page_title': 'Pegawai',
        }
        return render(request, 'pekerja/index.html', context)

    @method_decorator(login_required)
    def post(self, request):
        # Ambil data dari form
        nama = request.POST.get('pegawai_name')
        jabatan_id = request.POST.get('jabatan')  # ID dari jabatan yang dipilih

        try:
            with transaction.atomic():
                # Validasi jabatan
                jabatan = get_object_or_404(Jabatan, pk=jabatan_id)
                
                # Buat objek Pegawai baru
                pegawai = Pegawai(nama=nama, jabatan=jabatan)
                pegawai.save()

                # Jika berhasil, kembalikan response JSON dengan status sukses
                return JsonResponse({'success': True, 'message': 'Pegawai berhasil ditambah.'})
        
        except IntegrityError as e:
            # Jika terjadi kesalahan database, kembalikan response JSON
            return JsonResponse({'success': False, 'message': f'Kesalahan database: {str(e)}'})
        except Exception as e:
            # Tangkap kesalahan umum lainnya
            return JsonResponse({'success': False, 'message': f'Terjadi kesalahan: {str(e)}'})

        

class UpdatePekerjaView(View):
    @method_decorator(login_required)
    def post(self, request):
        # Ambil data dari request POST
        pegawai_id = request.POST.get('pegawai_id')
        nama = request.POST.get('pegawai_name')
        jabatan = request.POST.get('jabatan')

        # Validasi input
        if not pegawai_id or not nama or not jabatan:
            return JsonResponse({'success': False, 'message': 'Semua field harus diisi.'})

        try:
            with transaction.atomic():
                # Pastikan pegawai dengan ID yang diberikan ada di database
                pegawai = Pegawai.objects.select_for_update().get(id=pegawai_id)

                # Pastikan jabatan dengan ID yang diberikan ada di database
                jabatan_id = Jabatan.objects.select_for_update().get(id=jabatan)

                # Update data pegawai
                pegawai.nama = nama
                pegawai.jabatan = jabatan_id  # Relasi ForeignKey
                pegawai.save()

                return JsonResponse({
                    'success': True, 
                    'message': f"Pegawai '{pegawai.nama}' berhasil diupdate."
                })

        except Pegawai.DoesNotExist:
            # Tangani jika pegawai tidak ditemukan
            return JsonResponse({'success': False, 'message': 'Pegawai tidak ditemukan.'})
        except Jabatan.DoesNotExist:
            # Tangani jika jabatan tidak ditemukan
            return JsonResponse({'success': False, 'message': 'Jabatan tidak ditemukan.'})
        except Exception as e:
            # Tangani kesalahan lain
            return JsonResponse({
                'success': False, 
                'message': f"Terjadi kesalahan saat mengupdate pegawai: {str(e)}"
            })



class DeletePekerjaView(View):
    @method_decorator(login_required)
    def post(self, request):
        pegawai_id = request.POST.get('pegawai_id')  # Retrieve the ID from the form
        
        try:
            with transaction.atomic():
                # Find and delete the Pegawai by ID
                pegawai = Pegawai.objects.get(id=pegawai_id)
                pegawai_name = pegawai.nama  # Store the name of the deleted employee
                pegawai.delete()

                # Return a success response
                return JsonResponse({
                    'success': True,
                    'message': f"Pegawai '{pegawai_name}' berhasil dihapus."
                })
        
        except Pegawai.DoesNotExist:
            # Handle case where Pegawai is not found
            return JsonResponse({
                'success': False,
                'message': "Pegawai tidak ditemukan."
            })

        except Exception as e:
            # Handle other exceptions
            print(f'Error while deleting Pegawai: {e}')
            return JsonResponse({
                'success': False,
                'message': f"Gagal menghapus pegawai: {str(e)}"
            })
