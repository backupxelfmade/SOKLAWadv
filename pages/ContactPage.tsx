import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
      setErrorMessage('Failed to send message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f7f1] to-white">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have a legal matter or question? We're here to help. Reach out to us and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              {/* Office Location */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="bg-[#bfa06f] p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Office Location</h3>
                    <p className="text-gray-600 text-sm">
                      Upperhill Gardens, Block D1, 5th Floor<br />
                      Ragati Road, Nairobi, Kenya
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="bg-[#bfa06f] p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                    <a href="tel:+254205285048" className="text-[#bfa06f] hover:underline text-sm">
                      +254 20 528 5048
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="bg-[#bfa06f] p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                    <a href="mailto:info@soklaw.co.ke" className="text-[#bfa06f] hover:underline text-sm">
                      info@soklaw.co.ke
                    </a>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="bg-[#bfa06f] p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Office Hours</h3>
                    <p className="text-gray-600 text-sm">
                      Monday - Friday: 8:00 AM - 5:00 PM<br />
                      Saturday: On prior Appointment<br />
                      Sunday: On Prior Appointment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900">Message Sent Successfully!</h4>
                      <p className="text-sm text-green-700">We'll get back to you as soon as possible.</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900">Error Sending Message</h4>
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bfa06f] focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bfa06f] focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bfa06f] focus:border-transparent transition-all"
                        placeholder="+254 700 123 456"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bfa06f] focus:border-transparent transition-all"
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Corporate Law">Corporate Law</option>
                        <option value="Litigation">Litigation & Dispute Resolution</option>
                        <option value="Real Estate">Real Estate & Conveyancing</option>
                        <option value="Employment Law">Employment & Labour Law</option>
                        <option value="Family Law">Family & Succession Law</option>
                        <option value="Criminal Law">Criminal Law</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bfa06f] focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your legal matter..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-[#bfa06f] hover:bg-[#a08a5f] text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-[#bfa06f] to-[#a08a5f]">
              <h2 className="text-2xl font-bold text-white">Find Us</h2>
              <p className="text-white/90 mt-1">Visit our office in Upperhill, Nairobi</p>
            </div>
            <div className="relative w-full h-96">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Upperhill+Gardens+Ragati+Road+Nairobi+Kenya"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full relative group cursor-pointer overflow-hidden"
              >
                {/* Static Map Image Background */}
                <img
                  src="https://maps.googleapis.com/maps/api/staticmap?center=-1.2921,36.8219&zoom=14&size=1200x400&markers=color:0xbfa06f%7C-1.2921,36.8219&style=feature:poi%7Celement:labels%7Cvisibility:off&key=AIzaSyDummyKey"
                  alt="Map location"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if static map doesn't load
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                
                {/* Fallback styled map preview */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 hidden items-center justify-center">
                  <div className="relative">
                    {/* Map grid pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                        {[...Array(48)].map((_, i) => (
                          <div key={i} className="border border-gray-400"></div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Location marker */}
                    <div className="relative z-10 flex flex-col items-center">
                      <MapPin className="h-20 w-20 text-[#bfa06f] drop-shadow-lg" fill="#bfa06f" />
                      <div className="mt-4 text-center bg-white px-6 py-3 rounded-lg shadow-lg">
                        <p className="text-sm font-semibold text-gray-900">Upperhill Gardens</p>
                        <p className="text-xs text-gray-600">Ragati Road, Nairobi</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white px-6 py-4 rounded-lg shadow-xl">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-6 w-6 text-[#bfa06f]" />
                      <span className="text-gray-900 font-semibold">Click to open in Google Maps</span>
                      <svg className="h-5 w-5 text-[#bfa06f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
