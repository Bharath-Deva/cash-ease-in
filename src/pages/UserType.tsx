import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StepIndicator } from '@/components/StepIndicator';
import { Briefcase, Wallet, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

type UserType = 'salaried' | 'business' | null;

const UserType = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<UserType>(null);

  const handleContinue = () => {
    if (!selectedType) {
      toast.error('Please select a user type');
      return;
    }

    // Save user type
    const userData = JSON.parse(localStorage.getItem('c2c_user_data') || '{}');
    userData.userType = selectedType;
    localStorage.setItem('c2c_user_data', JSON.stringify(userData));

    toast.success(`Selected ${selectedType} type`);
    navigate('/identity');
  };

  const userTypes = [
    {
      type: 'salaried' as const,
      title: 'Salaried',
      description: 'Working professional with monthly income',
      icon: Wallet,
    },
    {
      type: 'business' as const,
      title: 'Business',
      description: 'Self-employed or business owner',
      icon: Briefcase,
    },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        <StepIndicator currentStep={2} totalSteps={5} />

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Select User Type</h1>
          <p className="text-muted-foreground">
            Choose the option that best describes you
          </p>
        </div>

        <div className="space-y-4">
          {userTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.type;

            return (
              <Card
                key={type.type}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? 'ring-2 ring-primary border-primary bg-primary/5'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedType(type.type)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {type.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {type.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedType}
          className="w-full"
          size="lg"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserType;
