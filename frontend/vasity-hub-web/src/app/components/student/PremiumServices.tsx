import { useState } from "react";
import { Navigation } from "../shared/Navigation";
import { premiumServices, getStudentProfile, purchasePremiumService } from "../../store";
import { Crown, Check, Sparkles, CreditCard } from "lucide-react";

export function PremiumServices() {
  const profile = getStudentProfile();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const hasPurchased = (serviceId: string) => {
    return profile.premiumServices?.some(ps => ps.serviceId === serviceId && ps.status === 'active');
  };

  const handlePurchase = (serviceId: string) => {
    if (confirm('Confirm purchase of this premium service?')) {
      setPurchasing(true);

      // Simulate payment processing
      setTimeout(() => {
        const result = purchasePremiumService(serviceId);
        setPurchasing(false);
        if (result.success) {
          setPurchaseSuccess(true);
          setSelectedService(null);
          setTimeout(() => setPurchaseSuccess(false), 3000);
        } else {
          alert('Purchase failed. Please try again.');
        }
      }, 1500);
    }
  };

  return (
    <div className="flex h-screen">
      <Navigation />

      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="text-[#FFB612]" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">Premium Services</h1>
            </div>
            <p className="text-gray-600">Upgrade your university application experience with our premium offerings</p>
          </div>

          {/* Success Message */}
          {purchaseSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <Check className="text-green-600" size={24} />
              <div>
                <p className="font-semibold text-green-900">Purchase Successful!</p>
                <p className="text-sm text-green-800">Your premium service is now active</p>
              </div>
            </div>
          )}

          {/* Active Services */}
          {profile.premiumServices && profile.premiumServices.length > 0 && (
            <div className="mb-8 bg-gradient-to-r from-[#FFB612] to-[#e5a510] text-gray-900 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={24} />
                <h2 className="text-xl font-bold">Your Premium Services</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {profile.premiumServices.map((service) => (
                  <div key={service.id} className="bg-white/20 backdrop-blur p-4 rounded-lg">
                    <p className="font-bold text-gray-900 mb-1">{service.serviceName}</p>
                    <p className="text-sm text-gray-800">
                      Purchased: {new Date(service.purchaseDate).toLocaleDateString()}
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">
                      {service.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Premium Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {premiumServices.map((service) => {
              const purchased = hasPurchased(service.id);
              const isSelected = selectedService === service.id;

              return (
                <div
                  key={service.id}
                  className={`bg-white rounded-lg border-2 transition-all ${
                    purchased
                      ? 'border-green-300 bg-green-50'
                      : isSelected
                      ? 'border-[#007A4D] shadow-lg'
                      : 'border-gray-200 hover:border-[#007A4D]/50'
                  }`}
                >
                  <div className="p-6">
                    {/* Service Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                        {purchased && (
                          <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded flex items-center gap-1">
                            <Check size={12} />
                            OWNED
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-[#007A4D]">R{service.price}</span>
                        <span className="text-sm text-gray-500">once-off</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6 space-y-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <Check className="text-[#007A4D] flex-shrink-0 mt-0.5" size={16} />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    {purchased ? (
                      <button
                        disabled
                        className="w-full py-3 bg-green-100 text-green-700 rounded-lg font-medium cursor-not-allowed"
                      >
                        Already Purchased
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedService(isSelected ? null : service.id)}
                        className={`w-full py-3 rounded-lg font-medium transition-colors ${
                          isSelected
                            ? 'bg-[#007A4D] text-white hover:bg-[#005a39]'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select Service'}
                      </button>
                    )}
                  </div>

                  {/* Purchase Panel */}
                  {isSelected && !purchased && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      <h4 className="font-bold text-gray-900 mb-3">Complete Purchase</h4>
                      <div className="mb-4 p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Service:</span>
                          <span className="font-medium text-gray-900">{service.name}</span>
                        </div>
                        <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
                          <span className="font-bold text-gray-900">Total:</span>
                          <span className="font-bold text-[#007A4D] text-lg">R{service.price}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePurchase(service.id)}
                        disabled={purchasing}
                        className="w-full py-3 bg-[#007A4D] text-white rounded-lg font-medium hover:bg-[#005a39] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {purchasing ? (
                          <>Processing...</>
                        ) : (
                          <>
                            <CreditCard size={20} />
                            Purchase Now
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Info Banner */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Why Upgrade?</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Get personalized guidance and support throughout your application journey</p>
              <p>• Access professional tools to enhance your application materials</p>
              <p>• Increase your chances of acceptance with expert insights</p>
              <p>• All purchases are one-time payments with lifetime access</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
