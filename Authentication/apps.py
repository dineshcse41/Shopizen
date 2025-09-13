from django.apps import AppConfig           # Django provides AppConfig to configure each application inside a Django project.
                                            # Every app in Django can have its own configuration class that defines settings like the app’s name, default fields, or custom startup logic.

class AuthenticationConfig(AppConfig):          # This defines a custom configuration class for your app named Authentication. It inherits from AppConfig, so you can override some attributes.
    default_auto_field = 'django.db.models.BigAutoField'        
    name = 'Authentication'
    
# This sets the default primary key field type for models in this app.

# By default, Django 3.2+ uses BigAutoField (a 64-bit integer) for primary keys instead of the older AutoField (32-bit integer).

# Example:

# id = models.BigAutoField(primary_key=True)

# name = 'Authentication'

# This tells Django the Python path / app name of this application.

# It connects the app’s configuration to your INSTALLED_APPS in settings.py.

# Example: In settings.py