from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Record

@csrf_exempt
def admin_login(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        username = body.get('username')
        password = body.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None and user.is_superuser:
            login(request, user)
            return JsonResponse({'status': 'success', 'message': f'Welcome, {user.username}!'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid credentials or not a superuser.'}, status=401)
    return JsonResponse({'status': 'error', 'message': 'POST request required.'}, status=400)

@csrf_exempt
def admin_logout(request):
    logout(request)
    return JsonResponse({'status': 'success', 'message': 'Logged out.'})

def add_record(request):
    new_record = Record.objects.create(text="Hello from Django! Record added successfully.")
    return JsonResponse({
        'status': 'success',
        'message': 'Record inserted into database',
        'record': {
            'id': new_record.id,
            'text': new_record.text,
            'created_at': new_record.created_at.isoformat()
        }
    })

def show_records(request):
    records = Record.objects.all().values('id', 'text', 'created_at')
    records_list = list(records)
    for r in records_list:
        r['created_at'] = r['created_at'].isoformat()
    return JsonResponse({
        'status': 'success',
        'count': len(records_list),
        'records': records_list
    })