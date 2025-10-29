import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { StepIndicator } from '@/components/StepIndicator';
import { validatePAN, validateGST } from '@/lib/utils/validation';
import { toast } from 'sonner';
import { ArrowRight, AlertCircle } from 'lucide-react';

const Identity = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'salaried' | 'business'>('salaried');
  const [identityType, setIdentityType] = useState<'pan' | 'gst'>('pan');
  const [identityNumber, setIdentityNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('c2c_user_data') || '{}');
    if (!userData.userType) {
      navigate('/user-type');
      return;
    }
    setUserType(userData.userType);
  }, [navigate]);

  const handleVerify = async () => {
    const isValid =
      identityType === 'pan'
        ? validatePAN(identityNumber.toUpperCase())
        : validateGST(identityNumber.toUpperCase());

    if (!isValid) {
      toast.error(
        `Invalid ${identityType === 'pan' ? 'PAN' : 'GST'} format`
      );
      return;
    }

    setLoading(true);
    
    // Simulate verification
    setTimeout(() => {
      const userData = JSON.parse(localStorage.getItem('c2c_user_data') || '{}');
      userData.identityType = identityType;
      userData.identityNumber = identityNumber.toUpperCase();
      userData.identityVerified = true;
      localStorage.setItem('c2c_user_data', JSON.stringify(userData));

      setLoading(false);
      toast.success('Identity verified successfully!');
      navigate('/kyc');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        <StepIndicator currentStep={3} totalSteps={5} />

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Identity Verification
          </h1>
          <p className="text-muted-foreground">
            {userType === 'salaried'
              ? 'Enter your PAN number for verification'
              : 'Choose verification method'}
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            {userType === 'business' && (
              <div className="flex gap-2 p-1 bg-muted rounded-lg">
                <button
                  onClick={() => {
                    setIdentityType('gst');
                    setIdentityNumber('');
                  }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    identityType === 'gst'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  GST
                </button>
                <button
                  onClick={() => {
                    setIdentityType('pan');
                    setIdentityNumber('');
                  }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    identityType === 'pan'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  PAN
                </button>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {identityType === 'pan' ? 'PAN Number' : 'GST Number'}
              </label>
              <Input
                type="text"
                placeholder={
                  identityType === 'pan' ? 'ABCDE1234F' : '22AAAAA0000A1Z5'
                }
                value={identityNumber}
                onChange={(e) => setIdentityNumber(e.target.value.toUpperCase())}
                className="uppercase font-mono"
                maxLength={identityType === 'pan' ? 10 : 15}
              />
            </div>

            {userType === 'business' && (
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-900">
                  Use registered business ID for faster verification
                </p>
              </div>
            )}

            <Button
              onClick={handleVerify}
              disabled={loading || !identityNumber}
              className="w-full"
              size="lg"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            Your information is encrypted and secure. We use bank-level security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Identity;
