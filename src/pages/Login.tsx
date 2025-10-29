import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { sendOtp, verifyOtp, isAuthenticated } from '@/lib/services/auth';
import { validatePhone, formatPhone } from '@/lib/utils/validation';
import { toast } from 'sonner';
import { Smartphone, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOtp = async () => {
    if (!validatePhone(phone)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    const result = await sendOtp(phone);
    setLoading(false);

    if (result.success) {
      setStep('otp');
      setResendTimer(30);
      toast.success('OTP sent successfully');
      toast.info('Use OTP: 123456 for testing');
    } else {
      toast.error(result.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    const result = await verifyOtp(phone, otp);
    setLoading(false);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/user-type');
    } else {
      toast.error(result.error || 'Invalid OTP');
      setOtp('');
    }
  };

  const handleResendOtp = async () => {
    setOtp('');
    await handleSendOtp();
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Smartphone className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Credit2Cash</h1>
          <p className="text-muted-foreground">
            Convert your credit limit to instant cash
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 'phone' ? 'Enter Mobile Number' : 'Verify OTP'}
            </CardTitle>
            <CardDescription>
              {step === 'phone'
                ? "We'll send you a one-time password"
                : `OTP sent to +91 ${formatPhone(phone)}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 'phone' ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 bg-muted rounded-lg border border-input">
                      <span className="text-sm font-medium text-muted-foreground">+91</span>
                    </div>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="flex-1"
                      maxLength={10}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSendOtp}
                  disabled={loading || phone.length !== 10}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Enter 6-digit OTP
                  </label>
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
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Resend OTP in {resendTimer}s
                    </p>
                  ) : (
                    <Button
                      variant="link"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-primary"
                    >
                      Resend OTP
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
