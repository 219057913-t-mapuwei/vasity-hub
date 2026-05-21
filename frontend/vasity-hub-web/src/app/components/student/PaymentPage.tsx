import { useState, useEffect } from "react";
import { Navigation } from "../shared/Navigation";
import { useNavigate, useSearchParams } from "react-router";
import {
  courses,
  getStudentProfile,
  updateStudentProfile,
  createPayment,
  processPayment,
  APPLICATION_FEE,
  Application
} from "../../store";
import { CreditCard, Building2, CheckCircle, XCircle, Loader, Shield, Lock, Download } from "lucide-react";

export function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const profile = getStudentProfile();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'eft'>('card');
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [paymentReference, setPaymentReference] = useState('');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  // Get pending application details from URL params
  const courseId = searchParams.get('courseId');
  const motivation = searchParams.get('motivation') || '';

  const course = courses.find(c => c.id === courseId);

  useEffect(() => {
    if (!courseId || !course) {
      navigate('/student/apply');
    }
  }, [courseId, course, navigate]);

  if (!course) {
    return null;
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'card' && (!cardNumber || !cardName || !cardExpiry || !cardCVV)) {
      alert('Please fill in all card details');
      return;
    }

    setProcessing(true);

    // Create application first
    const newApplication: Application = {
      id: `app-${Date.now()}`,
      courseId: course.id,
      courseName: course.name,
      university: course.university,
      studentSaId: profile.saId,
      status: 'submitted',
      submittedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      paymentStatus: 'pending'
    };

    // Create payment with additional details
    const payment = createPayment(newApplication.id, paymentMethod);
    newApplication.paymentId = payment.id;

    // Add payment reference and card details
    payment.referenceNumber = `VH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    if (paymentMethod === 'card' && cardNumber) {
      payment.cardLastFour = cardNumber.replace(/\s/g, '').slice(-4);
    }

    // Simulate payment processing
    setTimeout(() => {
      // Simulate 95% success rate
      const success = Math.random() > 0.05;

      processPayment(payment.id, success);

      if (success) {
        newApplication.paymentStatus = 'paid';
        updateStudentProfile({
          applications: [...profile.applications, newApplication]
        });
        setPaymentReference(payment.referenceNumber || '');
        setPaymentStatus('success');
      } else {
        setPaymentStatus('failed');
      }
      setProcessing(false);
    }, 3000);
  };

  const handleDownloadReceipt = () => {
    // Simulate receipt download
    alert('Receipt downloaded successfully!\n\nIn a real system, this would download a PDF receipt.');
  };

  const handleEmailReceipt = () => {
    alert(`Receipt sent to ${profile.email}\n\nIn a real system, this would email the receipt to the student.`);
  };

  if (paymentStatus === 'success') {
    return (
      <div className="flex h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center bg-gray-50 overflow-y-auto py-8">
          <div className="text-center max-w-2xl px-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your application to {course.name} has been submitted successfully.
            </p>

            {/* Receipt Card */}
            <div className="bg-white rounded-lg border-2 border-green-300 p-6 mb-6 text-left">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Payment Receipt</h3>
                  <p className="text-xs text-gray-500">Vasity Hub Central Application System</p>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  PAID
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Student Name:</span>
                  <span className="font-medium text-gray-900">{profile.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SA ID Number:</span>
                  <span className="font-mono font-medium text-gray-900">{profile.saId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Course:</span>
                  <span className="font-medium text-gray-900">{course.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">University:</span>
                  <span className="font-medium text-gray-900">{course.university}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Date:</span>
                  <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium text-gray-900">{paymentMethod === 'card' ? 'Credit Card' : 'EFT'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Reference Number:</span>
                  <span className="font-mono font-medium text-gray-900">{paymentReference}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
                <span className="font-bold text-gray-900">Amount Paid:</span>
                <span className="text-2xl font-bold text-green-600">R{APPLICATION_FEE}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={handleDownloadReceipt}
                className="flex-1 px-6 py-3 bg-[#007A4D] text-white rounded-lg font-medium hover:bg-[#005a39] flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download Receipt
              </button>
              <button
                onClick={handleEmailReceipt}
                className="flex-1 px-6 py-3 bg-white border-2 border-[#007A4D] text-[#007A4D] rounded-lg font-medium hover:bg-[#007A4D]/5 flex items-center justify-center gap-2"
              >
                Email Receipt
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/student/applications')}
                className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
              >
                Track Application
              </button>
              <button
                onClick={() => navigate('/student/dashboard')}
                className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="flex h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={48} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              We couldn't process your payment. Please try again or contact support if the problem persists.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setPaymentStatus('pending')}
                className="px-6 py-3 bg-[#007A4D] text-white rounded-lg font-medium hover:bg-[#005a39]"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/student/apply')}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50"
              >
                Back to Application
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Processing screen
  if (processing) {
    return (
      <div className="flex h-screen">
        <Navigation />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="relative">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <div className="absolute inset-0 border-4 border-[#007A4D]/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-[#007A4D] rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="text-[#007A4D]" size={40} />
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
              <p className="text-gray-600 mb-6">Please wait while we securely process your payment...</p>

              {/* Payment Gateway Branding */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <Lock className="text-gray-400" size={16} />
                  <span className="text-xs text-gray-500">Secured by</span>
                </div>
                <div className="flex items-center justify-center gap-6">
                  <div className="px-4 py-2 bg-[#00457C] text-white rounded font-bold text-sm">
                    PayFast
                  </div>
                  <div className="text-gray-400">|</div>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-6 bg-[#635BFF]"></div>
                    <div className="w-1 h-6 bg-[#0A2540]"></div>
                    <span className="font-bold text-[#635BFF] text-lg ml-1">stripe</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Shield size={14} />
                  <span>256-bit SSL encryption</span>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Do not close or refresh this page
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment</h1>
            <p className="text-gray-600">Complete payment to submit your application</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Application Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-6">
                <h2 className="font-bold text-gray-900 mb-4">Application Summary</h2>
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Course</p>
                    <p className="font-medium text-gray-900">{course.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">University</p>
                    <p className="font-medium text-gray-900">{course.university}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Student SA ID</p>
                    <p className="font-mono font-medium text-gray-900">{profile.saId}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Application Fee</span>
                    <span className="font-bold text-gray-900">R{APPLICATION_FEE}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-[#007A4D]">R{APPLICATION_FEE}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-gray-900">Select Payment Method</h2>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Shield size={14} className="text-green-600" />
                    <span>Secure Payment</span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#007A4D] bg-[#007A4D]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className={paymentMethod === 'card' ? 'text-[#007A4D]' : 'text-gray-400'} size={24} />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Credit Card</p>
                      <p className="text-xs text-gray-500">Instant payment</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('eft')}
                    className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                      paymentMethod === 'eft'
                        ? 'border-[#007A4D] bg-[#007A4D]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building2 className={paymentMethod === 'eft' ? 'text-[#007A4D]' : 'text-gray-400'} size={24} />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">EFT</p>
                      <p className="text-xs text-gray-500">Bank transfer</p>
                    </div>
                  </button>
                </div>

                <form onSubmit={handlePayment}>
                  {paymentMethod === 'card' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                          maxLength={19}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            maxLength={5}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent font-mono"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cardCVV}
                            onChange={(e) => setCardCVV(e.target.value)}
                            maxLength={3}
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A4D] focus:border-transparent font-mono"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">EFT Payment Instructions</h3>
                      <div className="text-sm text-blue-800 space-y-2">
                        <p><strong>Bank:</strong> Standard Bank</p>
                        <p><strong>Account Name:</strong> Vasity Hub</p>
                        <p><strong>Account Number:</strong> 1234567890</p>
                        <p><strong>Branch Code:</strong> 051001</p>
                        <p><strong>Reference:</strong> {profile.saId}</p>
                        <p className="mt-3 text-blue-700">
                          Please use your SA ID number as the payment reference. Payment may take 1-2 business days to reflect.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-start gap-2">
                    <Lock className="text-gray-400 flex-shrink-0 mt-0.5" size={16} />
                    <div className="text-xs text-gray-600">
                      <p className="font-medium mb-1">Your payment is secure</p>
                      <p>We use industry-standard encryption to protect your payment information. Your card details are never stored on our servers.</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-6 bg-[#007A4D] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#005a39] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                  >
                    {processing ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock size={20} />
                        Pay R{APPLICATION_FEE} Securely
                      </>
                    )}
                  </button>

                  {/* Gateway Logos */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center mb-3">Powered by</p>
                    <div className="flex items-center justify-center gap-6">
                      <div className="px-3 py-1.5 bg-[#00457C] text-white rounded font-bold text-xs">
                        PayFast
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-0.5 h-4 bg-[#635BFF]"></div>
                        <div className="w-0.5 h-4 bg-[#0A2540]"></div>
                        <span className="font-bold text-[#635BFF] text-sm ml-0.5">stripe</span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* System Notice */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Shield className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Payment Required Before Application Submission</p>
              <p>Your application will only be submitted after successful payment. If payment fails, your application will not be processed and no charges will be made.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
