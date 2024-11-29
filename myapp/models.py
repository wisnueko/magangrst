from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
import uuid, random, string



ROLE_CHOICES = [
    ('admin', 'Admin'),
    ('superadmin', 'SuperAdmin'),
    ('staffdepartement', 'StaffDepartement'),
    ('posting', 'Posting'),
]

ACCESS_CHOICES = [
    ('public', 'Public'),
    ('private', 'Private'),
]

class AccountManager(BaseUserManager):
    
    use_in_migrations = True

    def _create_user(self, email, username, phone, password, **extra_fields):
        values = [email, username, phone,]
        field_value_map = dict(zip(self.model.REQUIRED_FIELDS, values))
        for field_name, value in field_value_map.items():
            if not value:
                raise ValueError('The {} value must be set'.format(field_name))

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            username=username,
            phone=phone,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, username, phone, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, username, phone, password, **extra_fields)

    def create_superuser(self, email, username, phone, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        if extra_fields.get('is_verified') is not True:
            raise ValueError('Superuser must have is_verified=True.')

        return self._create_user(email, username, phone, password, **extra_fields)

class Departement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nama = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nama

class Kategory(models.Model):
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nama = models.CharField(max_length=100)
    departement = models.ForeignKey(Departement, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return self.nama

class Jabatan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nama = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nama
    
class Pegawai(models.Model):
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nama = models.CharField(max_length=100)
    jabatan = models.ForeignKey(Jabatan, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return self.nama
    


class Gaji(models.Model):
    class StatusGaji(models.TextChoices):
        PENDING = 'PENDING', ('Pending')
        APPROVED = 'APPROVED', ('Approved')
        REJECTED = 'REJECTED', ('Rejected')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tanggal = models.DateField()
    jabatan = models.ForeignKey( Jabatan, on_delete=models.SET_NULL, null=True, blank=True)  # Relasi ke model Jabatan
    qty = models.PositiveIntegerField()  # Kuantitas harus positif
    satuan = models.CharField(max_length=50)  # Deskripsi satuan
    nilai = models.DecimalField(max_digits=10, decimal_places=2)  # Nilai per satuan
    subtotal = models.DecimalField(max_digits=15, decimal_places=2, editable=False)  # Total nilai
    status_gaji = models.CharField(
        max_length=10,
        choices=StatusGaji.choices,
        default=StatusGaji.PENDING,
    )
    uraian = models.ForeignKey( Pegawai, on_delete=models.SET_NULL, null=True, blank=True)  # Relasi ke model Pegawai

    def save(self, *args, **kwargs):
        # Hitung subtotal sebelum disimpan
        self.subtotal = self.qty * self.nilai
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.uraian.nama} - {self.tanggal}"
# Create your models here.


class Master_User(AbstractBaseUser):
    user_id = models.TextField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(unique=True)
    username = models.CharField(unique=True, max_length=50)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    # Menambahkan ForeignKey ke Departement
    departement = models.ForeignKey(Departement, on_delete=models.SET_NULL, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True)
    phone = models.CharField(max_length=15)
    date_of_birth = models.DateField(blank=True, null=True)
    # avatar = models.ImageField(blank=True, null=True, upload_to='images/avatar/')
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='posting')
    email_verification_token = models.CharField(max_length=100, default='')
    

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'phone', 'role', ]

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def get_short_name(self):
        return self.first_name
