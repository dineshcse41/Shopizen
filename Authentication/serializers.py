from rest_framework_simplejwt.serializers import TokenObtainPairSerializer   #TokenObtainPairSerializer → Built-in serializer in SimpleJWT that handles user login and returns two tokens:
# access token (short-lived)
# refresh token (long-lived, used to generate new access tokens)

class CustomToken_Serializer(TokenObtainPairSerializer):
    
    def validate(self, attrs):
        data = super().validate(attrs)      # super().validate(attrs)
                                            # Calls parent TokenObtainPairSerializer’s validate() method.
                                            # This does:
                                            # Validates username and password.
                                            # If valid → generates JWT access and refresh tokens.
                                            # Returns them as a dictionary:
        
        data.update({
            'username' : self.user.username,        # self.user → the authenticated user object.
            'password' : self.user.password,
            "date": self.user.date_joined
        })
        
        return data
    
# DATA.UPDATE (CODE AND LOGIC) 

# Adds extra fields to the token response:

# username → user’s name.

# password → ⚠️ this is dangerous because it will expose the hashed password in API response.

# date → when the user registered (date_joined).