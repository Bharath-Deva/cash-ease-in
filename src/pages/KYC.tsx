import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { StepIndicator } from '@/components/StepIndicator';
import { validateAadhaar, formatAadhaar } from '@/lib/utils/validation';
import { toast } from 'sonner';
import { ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';

const KYC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'aadhaar' | 'otp' | 'success'>('aadhaar');
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('c2c_user_data') || '{}');
    if (!userData.identityVerified) {
      navigate('/identity');
    }
  }, [navigate]);

  const handleSendAadhaarOtp = async () => {
    if (!validateAadhaar(aadhaar)) {
      toast.error('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      toast.success('OTP sent to registered mobile');
      toast.info('Use OTP: 123456 for testing');
    }, 800);
  };

  const handleVerifyAadhaarOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      if (otp === '123456') {
        const userData = JSON.parse(localStorage.getItem('c2c_user_data') || '{}');
        userData.aadhaarVerified = true;
        userData.aadhaar = aadhaar;
        localStorage.setItem('c2c_user_data', JSON.stringify(userData));

        setLoading(false);
        setStep('success');
        toast.success('Aadhaar verified successfully!');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setLoading(false);
        toast.error('Incorrect OTP — try again');
        setOtp('');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        <StepIndicator currentStep={4} totalSteps={5} />

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Aadhaar KYC</h1>
          <p className="text-muted-foreground">
            Complete your verification with Aadhaar
          </p>
        </div>

        {step === 'success' ? (
          <Card className="border-success">
            <CardContent className="p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-bg">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Verification Complete!
                </h3>
                <p className="text-muted-foreground mt-2">
                  Redirecting to dashboard...
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm text-foreground">
                  Secure verification powered by UIDAI
                </p>
              </div>

              {step === 'aadhaar' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Aadhaar Number
                    </label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012"
                      value={formatAadhaar(aadhaar)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                        setAadhaar(value);
                      }}
                      className="text-center text-lg tracking-wider font-semibold"
                    />
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => navigate('/identity')}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={handleSendAadhaarOtp}
                      disabled={loading || aadhaar.length !== 12}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Enter OTP
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Sent to Aadhaar registered mobile
                    </p>
                    <Input
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="text-center text-2xl tracking-widest font-semibold"
                      maxLength={6}
                    />
                  </div>

                  <Button
                    onClick={handleVerifyAadhaarOtp}
                    disabled={loading || otp.length !== 6}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setStep('aadhaar')}
                    disabled={loading}
                    className="w-full"
                  >
                    Change Aadhaar Number
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default KYC;
