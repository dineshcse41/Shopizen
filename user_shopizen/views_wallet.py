from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from decimal import Decimal
from .models import Wallet, WalletTransaction
from .serializers import WalletSerializer, WalletTransactionSerializer

# Helper function — ensure wallet exists for user
def get_or_create_wallet(user):
    wallet, created = Wallet.objects.get_or_create(user=user)
    return wallet


# 1️⃣ GET /api/wallet/ → Show wallet balance
class WalletBalanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet = get_or_create_wallet(request.user)
        serializer = WalletSerializer(wallet)
        return Response(serializer.data)


# 2️⃣ POST /api/wallet/add/ → Add dummy funds (test credits)
class WalletAddFundsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        amount = request.data.get('amount')
        try:
            amount = Decimal(amount)
        except:
            return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

        wallet = get_or_create_wallet(request.user)
        wallet.balance += amount
        wallet.save()

        WalletTransaction.objects.create(
            wallet=wallet,
            transaction_type='Credit',
            amount=amount,
            description='Funds added to wallet'
        )

        return Response({
            'message': f'₹{amount} added successfully!',
            'new_balance': wallet.balance
        }, status=status.HTTP_200_OK)


# 3️⃣ GET /api/wallet/transactions/ → View wallet transaction history
class WalletTransactionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet = get_or_create_wallet(request.user)
        transactions = wallet.transactions.all().order_by('-created_at')
        serializer = WalletTransactionSerializer(transactions, many=True)
        return Response(serializer.data)
