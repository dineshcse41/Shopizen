from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        # Unknown error fallback
        return Response({'error': 'Unexpected server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle 403 Forbidden
    if response.status_code == 403:
        response.data = {'error': 'You do not have permission to perform this action (403 Forbidden).'}

    # Handle 401 Unauthorized (Session Expired)
    elif response.status_code == 401:
        response.data = {'error': 'Session expired. Please login again.'}

    return response
