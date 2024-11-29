from urllib import request
from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from django.views import View
from myapp.models import * # Pastikan model Gaji dan Pegawai diimport
from django.contrib import messages
from django.urls import reverse
from django.db import transaction, IntegrityError
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import JsonResponse


class GajiView(View):
    @method_decorator(login_required)
    def get(self, request):
        # Fetch all gaji data
        gaji_list = Gaji.objects.select_related('uraian', 'jabatan').all()
        jabatan_list = Jabatan.objects.all()
        pegawai_list = Pegawai.objects.all()

        context = {
            'gaji_list': gaji_list,
            'jabatan_list': jabatan_list,
            'pegawai_list': pegawai_list,
            'page_title': 'Slip Gaji',
        }
        return render(request, 'gaji/index.html', context)
    
    @method_decorator(login_required)
    def post(self, request):
        # Ambil data dari form
        pegawai_id = request.POST.get('uraian_id')  # ID dari pegawai yang dipilih
        tanggal = request.POST.get('tanggal')  # Tanggal slip gaji
        jabatan_id = request.POST.get('jabatan')  # ID dari jabatan yang dipilih
        qty = request.POST.get('qty')  # Kuantitas
        satuan = request.POST.get('satuan')  # Satuan kerja
        nilai = request.POST.get('nilai')  # Nilai per satuan
        status_gaji = request.POST.get('status_gaji', 'PENDING')  # Status gaji default PENDING

        # Validasi input
        if not (pegawai_id and tanggal and jabatan_id and qty and satuan and nilai):
            return JsonResponse({'success': False, 'message': 'Semua field harus diisi.'})

        try:
            # Pastikan bahwa qty dan nilai adalah angka valid
            qty = int(qty)
            nilai = float(nilai)

            # Validasi qty dan nilai harus lebih besar dari 0
            if qty <= 0 or nilai <= 0:
                return JsonResponse({'success': False, 'message': 'Qty dan Nilai harus bernilai positif.'})

            with transaction.atomic():
                # Validasi dan ambil objek terkait
                pegawai = get_object_or_404(Pegawai, pk=pegawai_id)
                jabatan = get_object_or_404(Jabatan, pk=jabatan_id)

                # Buat objek Gaji baru
                slip_gaji = Gaji.objects.create(
                    tanggal=tanggal,
                    jabatan=jabatan,
                    qty=qty,
                    satuan=satuan,
                    nilai=nilai,
                    status_gaji=status_gaji,
                    uraian=pegawai,  # Relasi ke Pegawai
                )

                # Jika berhasil, kembalikan response JSON
                return JsonResponse({'success': True, 'message': 'Gaji berhasil ditambah.'})
        
        except IntegrityError as e:
            return JsonResponse({'success': False, 'message': f'Kesalahan database: {str(e)}'})
        except ValueError:
            return JsonResponse({'success': False, 'message': 'Qty dan Nilai harus berupa angka valid.'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Terjadi kesalahan: {str(e)}'})
        


class UpdateGajiView(View):
    @method_decorator(login_required)
    def post(self, request):
        gaji_id = request.POST.get('gaji_id')
        tanggal = request.POST.get('tanggal')
        uraian_id = request.POST.get('uraian_id')
        jabatan_id = request.POST.get('jabatan')
        qty = request.POST.get('qty')
        satuan = request.POST.get('satuan')
        nilai = request.POST.get('nilai')
        status_gaji = request.POST.get('status_gaji')

        # Validate all fields are filled
        if not gaji_id or not tanggal or not uraian_id or not jabatan_id or not qty or not satuan or not nilai or not status_gaji:
            return JsonResponse({'success': False, 'message': 'Semua field harus diisi.'})

        # Convert `qty` and `nilai` to the correct types (int or float)
        try:
            qty = int(qty)  # Convert qty to integer
            nilai = float(nilai)  # Convert nilai to float
        except ValueError:
            return JsonResponse({'success': False, 'message': 'Qty atau Nilai tidak valid.'})

        try:
            with transaction.atomic():
                gaji = Gaji.objects.select_for_update().get(id=gaji_id)
                uraian = Pegawai.objects.get(id=uraian_id)  # Assuming uraian is a Pegawai object
                jabatan = Jabatan.objects.get(id=jabatan_id)  # Assuming jabatan is a Jabatan object

                # Update fields
                gaji.tanggal = tanggal
                gaji.uraian = uraian
                gaji.jabatan = jabatan
                gaji.qty = qty
                gaji.satuan = satuan
                gaji.nilai = nilai
                gaji.status_gaji = status_gaji
                gaji.save()

                return JsonResponse({
                    'success': True,
                    'message': 'Data gaji berhasil diupdate.'
                })

        except Gaji.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Gaji tidak ditemukan.'})
        except Pegawai.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Pegawai tidak ditemukan.'})
        except Jabatan.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Jabatan tidak ditemukan.'})
        except Exception as e:
            print(f"Error updating gaji: {e}")
            return JsonResponse({'success': False, 'message': 'Gagal mengupdate data gaji.'})
    
class DeleteGajiView(View):
    @method_decorator(login_required)
    def post(self, request):
        gaji_id = request.POST.get('gaji_id')  # Retrieve the ID of the 'Gaji' record
        
        try:
            with transaction.atomic():
                # Find and delete the Gaji by ID
                gaji = Gaji.objects.get(id=gaji_id)
                gaji_tanggal = gaji.tanggal  # Optionally store the date or any field to show in the message
                gaji.delete()

                # Return a success response with the message including the Gaji date or any other detail
                return JsonResponse({
                    'success': True,
                    'message': f"Gaji pada tanggal {gaji_tanggal} berhasil dihapus."
                })
        
        except Gaji.DoesNotExist:
            # Handle case where Gaji is not found
            return JsonResponse({
                'success': False,
                'message': "Gaji tidak ditemukan."
            })

        except Exception as e:
            # Handle any other exceptions (e.g., database errors)
            print(f'Error while deleting Gaji: {e}')
            return JsonResponse({
                'success': False,
                'message': f"Gagal menghapus data gaji: {str(e)}"
            })
