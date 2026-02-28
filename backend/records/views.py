from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Record
from .serializers import RecordSerializer

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

@csrf_exempt
def add_record(request):

    record = Record.objects.create(
        text="Hello from Django! Record added successfully."
    )

    serializer = RecordSerializer(record)

    return JsonResponse({
        'status': 'success',
        'message': 'Record inserted into database',
        'record': serializer.data
    })

def show_records(request):

    records = Record.objects.all()

    serializer = RecordSerializer(records, many=True)

    return JsonResponse({
        'status': 'success',
        'count': len(serializer.data),
        'records': serializer.data
    })

@csrf_exempt
def delete_record(request, record_id):

    if request.method == 'DELETE':

        try:

            record = Record.objects.get(id=record_id)

            serializer = RecordSerializer(record)

            record.delete()

            return JsonResponse({
                'status': 'success',
                'message': 'Record deleted',
                'deleted_record': serializer.data
            })

        except Record.DoesNotExist:

            return JsonResponse({
                'status': 'error',
                'message': 'Record not found'
            }, status=404)

    return JsonResponse({
        'status': 'error',
        'message': 'DELETE required'
    }, status=400)