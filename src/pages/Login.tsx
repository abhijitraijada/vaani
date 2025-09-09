import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { loginUser, clearError } from '../store/userSlice';
import { Form, FormSection, FormActions } from '../components/form/Form';
import { Field, FieldLabel, FieldError, PhoneInput, TextInput } from '../components/form/Fields';
import { Button } from '../components/primitives/Button';
import { Heading } from '../components/primitives/Typography';
import { Icon } from '../components/primitives/Icon';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.user);

  const [formData, setFormData] = useState({
    phone_number: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({
    phone_number: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      phone_number: '',
      password: '',
    };

    if (!formData.phone_number.trim()) {
      errors.phone_number = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone_number.replace(/\s/g, ''))) {
      errors.phone_number = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(loginUser(formData)).unwrap();
      navigate('/');
    } catch {
      // Error is handled by Redux
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Heading className="text-3xl font-bold text-gray-900">
            Sign in to your account
          </Heading>
          <div className="mt-2 text-sm text-gray-600">
            Enter your phone number and password to access your account
          </div>
        </div>

        <Form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <FormSection>
            <Field>
              <FieldLabel>Phone Number</FieldLabel>
              <PhoneInput
                id="phone_number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="1234567890"
                aria-invalid={!!formErrors.phone_number}
                disabled={isLoading}
                className="mt-1"
              />
              <FieldError>{formErrors.phone_number}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <div className="relative mt-1">
                <TextInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  aria-invalid={!!formErrors.password}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <Icon 
                    name={showPassword ? "eye-off" : "eye"} 
                    width={20} 
                    height={20}
                    className="text-gray-400 hover:text-gray-600"
                  />
                </button>
              </div>
              <FieldError>{formErrors.password}</FieldError>
            </Field>
          </FormSection>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <FormActions>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </FormActions>
        </Form>
      </div>
    </div>
  );
}
