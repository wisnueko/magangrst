from django.urls import path, include, re_path
from .views import *

app_name = 'myapp'

urlpatterns = [
    path('', auth.LoginViews.as_view(), name='login'),
    path('logout/', auth.LogoutViews.as_view(), name='logout'),
    path('dashboard/', dashboard.DasboardViews.as_view(), name = 'dashboard'),
    path('departement/', departement.DepartementViews.as_view(), name='departement'),  # Menampilkan dan menambah departemen
    path('departement/update/', departement.UpdateDepartementView.as_view(), name='update_departement'),  # Mengupdate departemen
    path('departement/delete/', departement.DeleteDepartementView.as_view(), name='delete_departement'),  # Menghapus departemen
    path('user/', user.UserViews.as_view(), name='user'),  # Menampilkan dan menambah user
    path('user/update/', user.UpdateUserView.as_view(), name='update_user'),  # Mengupdate user
    path('user/delete/', user.DeleteUserView.as_view(), name='delete_user'),  # Menghapus user
    path('kategori/', kategory.KategoryView.as_view(), name='kategory'),  # Menampilkan dan menambah kategory
    path('kategori/update', kategory.UpdateKategoryView.as_view(), name='update_kategory'),  # edit kategory
    path('kategori/delete', kategory.DeleteKategoryView.as_view(), name='delete_kategory'),  # menghapus kategory
    path('pekerja/', pekerja.PekerjaView.as_view(), name='pekerja'),  # Menampilkan dan menambah pekerja
    path('pekerja/update', pekerja.UpdatePekerjaView.as_view(), name='update_pekerja'),  # edit data pekerja
    path('pekerja/delete', pekerja.DeletePekerjaView.as_view(), name='delete_pekerja'),  # menghapus data pekerja
    path('slipgaji/', slipgaji.GajiView.as_view(), name='gaji'),  # Menampilkan dan menambah gaji
    path('slipgaji/update', slipgaji.UpdateGajiView.as_view(), name='update_gaji'),  # Menampilkan dan menambah gaji
    path('slipgaji/delete', slipgaji.DeleteGajiView.as_view(), name='delete_gaji'),  # Menampilkan dan menambah gaji
    path('jabatan/', jabatanpegawai.JabatanView.as_view(), name='jabatan'),  # view dan add jabatan
    path('jabatan/update', jabatanpegawai.UpdateJabatanView.as_view(), name='update_jabatan'),  # update jabatan
    path('jabatan/delete', jabatanpegawai.DeleteJabatanView.as_view(), name='delete_jabatan'),  # hapus jabatan
    
]