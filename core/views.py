from django.http import JsonResponse

def custom_404_view(request, exception=None):
    return JsonResponse({
        'success': False,
        'status_code': 404,
        'error': 'The requested resource was not found.'
    }, status=404)

def custom_403_view(request, exception=None):
    return JsonResponse({
        'success': False,
        'status_code': 403,
        'error': 'Access forbidden. You do not have permission.'
    }, status=403)
