from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Custom global exception handler for DRF.
    """
    # Call default handler first to get standard error response.
    response = exception_handler(exc, context)

    if response is not None:
        # Add uniform format
        response.data = {
            'success': False,
            'status_code': response.status_code,
            'error': response.data
        }

        # Log error
        logger.error(f"{context['view'].__class__.__name__}: {exc}")

    else:
        # Handle unexpected errors
        logger.exception(f"Unhandled Exception: {exc}")
        response = Response({
            'success': False,
            'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
            'error': 'Internal server error occurred. Please try again later.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response
