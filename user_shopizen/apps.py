from django.apps import AppConfig


class UserShopizenConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user_shopizen'

# user_shopizen/apps.py
def ready(self):
    import user_shopizen.signals
