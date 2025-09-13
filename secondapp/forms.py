from django import forms            # Django provides a powerful forms framework to handle user input.
                                    # forms includes tools for creating HTML forms, validating input, and saving data.
from .models import Product         # This imports the Product model from your current app’s models.py.
                                    # You’ll use this model to automatically generate form fields.

class ProductForm(forms.ModelForm):             #You’re creating a form class called ProductForm. , # It inherits from forms.ModelForm, which means: Django will auto-generate form fields based on the model fields. , You don’t need to define each input field manually.
    class Meta:
        model = Product
        fields = ['name', 'price', 'description', 'image', 'category', 'brand']


# The Meta class provides configuration for the form.

# model = Product
# → This tells Django that the form is linked to the Product model.

# fields = [...]
# → Specifies which fields from the Product model should appear in the form.
# In this case:

# name → Product name (text field)

# price → Price (number/decimal field)

# description → Description (textarea field)

# image → Image upload field

# category → ForeignKey/Choice field (from Category model)

# brand → ForeignKey/Choice field (from Brand model)

# If you didn’t specify fields, Django would include all model fields by default (if you used fields = '__all__').

# 🔑 Logic in Simple Terms

# This form is directly tied to the Product model.

# When you use this form in a view:

# It will render HTML inputs for product details.

# It will validate user input (e.g., required fields, data types).

# It can save the data directly into the database with form.save().